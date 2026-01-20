---
title: "Setup Filebrowser-Quantum with Cloudflare on Docker"
date: 2026-01-08T14:00:00+07:00
draft: false
pin: false
author: "Khusika"
authorLink: "https://khusika.id"
gravatarEmail: "khusikadhamar@gmail.com"
description: "Learn how to deploy Filebrowser, OnlyOffice, and Cloudflare Tunnel on Docker for a powerful, personal cloud solution."
resources:
- name: "featured-image"
  src: "featured-image.webp"

tags: ["docker", "filebrowser", "onlyoffice", "cloudflare"]
categories: ["Blogs"]

toc:
  enable: true
math:
  enable: false
lightgallery: false
license: '<a rel="license external nofollow noopener noreffer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'
---

Learn to deploy a secure personal cloud with Filebrowser-Quantum, OnlyOffice, and Cloudflare Tunnel using Docker.

<!--more-->

## Introduction to the Components

*   **Filebrowser-Quantum**: A web-based file manager that lets you upload, download, manage, and share your files. We'll be using the [gtstef/filebrowser](https://hub.docker.com/r/gtstef/filebrowser) fork, which includes some nice enhancements.
*   **OnlyOffice Document Server**: An open-source office suite that provides online editors for text documents, spreadsheets, and presentations. We'll integrate it with Filebrowser to edit documents directly in the browser.
*   **Cloudflare Tunnel**: A service that creates a secure, outbound-only connection between your server and the Cloudflare network. This allows you to expose your services to the internet without opening up any ports on your firewall, protecting you from direct attacks.

## Prerequisites

Before you begin, make sure you have the following installed on your server:

*   **Docker**: [Install Docker](https://docs.docker.com/engine/install/)
*   **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
*   A **Cloudflare account** and a domain name connected to it. You will need two separate subdomains (or domains): one for Filebrowser and one for OnlyOffice.

## 1. Project Structure

First, let's create a directory for our project and the necessary subdirectories and files.

```bash
mkdir my-cloud
cd my-cloud
mkdir -p filebrowser
touch docker-compose.yml .env filebrowser/config.json
```

This will be the structure:
```
my-cloud/
├── docker-compose.yaml
├── .env
├── filebrowser/
│   ├── data/
│   │   └── config.json
│   └── Home/
├── onlyoffice/
│   ├── data/
│   ├── log/
│   └── welcome/
└── postgresql/
    └── data/
```

## 2. Docker Compose Configuration

Now, let's set up our `docker-compose.yml`. This file defines all the services, networks, and volumes needed for our application stack. Instead of one large file, we'll break it down by service to make it easier to understand.

Create a `docker-compose.yml` file and add the following services one by one.

### Cloudflared

This service creates a secure tunnel from your server to the Cloudflare network, exposing your local services to the internet without opening any firewall ports.

```yaml
services:
  cloudflared:
    env_file: "./.env"
    image: cloudflare/cloudflared:latest
    container_name: cloudflare-tunnel
    hostname: "cloudflare-tunnel"
    restart: unless-stopped
    pull_policy: missing
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "10"
    network_mode: "host"
    command: tunnel run
    environment:
      TUNNEL_TOKEN: ${CLOUDFLARE_SECRET}
      TUNNEL_METRICS: 127.0.0.1:61616
    volumes:
      - /etc/localtime:/etc/localtime:ro
    healthcheck:
      test: ["CMD", "cloudflared", "tunnel", "--metrics", "localhost:61616", "ready"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
```
- `TUNNEL_TOKEN`: This is the secret token you get from the Cloudflare Zero Trust dashboard to authenticate your tunnel.
- `network_mode: "host"`: This is required for the tunnel to correctly route traffic to your other Docker containers.

### Filebrowser

This is the core file manager service. It's a feature-rich web application for managing your files.

```yaml
  filebrowser:
    env_file: "./.env"
    image: gtstef/filebrowser:latest
    pull_policy: missing
    container_name: filebrowser
    networks:
      - onlyoffice-network
    environment:
      FILEBROWSER_CONFIG: ${FB_CONFIG}
      FILEBROWSER_DATABASE: ${FB_DB}
      FILEBROWSER_ADMIN_PASSWORD: ${FB_PWD}
      FILEBROWSER_ONLYOFFICE_SECRET: ${OFFICE_SECRET}
      TZ: ${TZ_ID}
    volumes:
      - ./filebrowser:/srv
      - ./filebrowser/data:/home/filebrowser/data
      - ./filebrowser/data/icons:/home/filebrowser/http/dist/img/icons
      - ./filebrowser/Home:/srv/Home
      - /path/to/your/external/drive:/srv/External
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    ports:
      - '80:80'
    restart: unless-stopped
```
- `environment`: We pass several variables to configure Filebrowser, including the path to the config file, database, admin password, and the OnlyOffice JWT secret.
- `volumes`: We mount several directories, including one for your main files (`/srv/Home`) and another for an external drive (`/srv/External`).
- `ports`: We expose port `80` so it's accessible locally for Cloudflare Tunnel to pick up.

### OnlyOffice Document Server

This service provides the powerful document editing suite that integrates with Filebrowser.

```yaml
  onlyoffice:
    image: onlyoffice/documentserver:latest
    container_name: onlyoffice
    depends_on:
      - postgres
      - rabbitmq
    environment:
      DATABASE_URL: "postgres://onlyoffice:onlyoffice@postgres/onlyoffice"
      AMQP_URI: "amqp://guest:guest@rabbitmq"
      JWT_ENABLED: "true"
      JWT_SECRET: ${OFFICE_SECRET}
    ports:
      - '81:80'
    restart: unless-stopped
    networks:
      - onlyoffice-network
    volumes:
      - ./onlyoffice/data:/var/www/onlyoffice/Data
      - ./onlyoffice/log:/var/log/onlyoffice
      - ./onlyoffice/welcome:/var/www/onlyoffice/documentserver-example/welcome:rw
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/info/info.json"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
```
- `depends_on`: This ensures that `postgres` and `rabbitmq` are started before OnlyOffice.
- `JWT_SECRET`: This must be the same secret key provided to Filebrowser to secure the integration.
- `ports`: We map the internal port `80` to the host's port `81`, which Cloudflare Tunnel will use.

### Supporting Services (Postgres & RabbitMQ)

OnlyOffice requires a database and a message broker to function correctly.

```yaml
  postgres:
    image: postgres:15
    container_name: postgres
    environment:
      POSTGRES_DB: onlyoffice
      POSTGRES_USER: onlyoffice
      POSTGRES_PASSWORD: onlyoffice
    volumes:
      - ./postgresql/data:/var/lib/postgresql/data
    networks:
      - onlyoffice-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U onlyoffice"]
      interval: 10s
      retries: 3
      start_period: 10s
      timeout: 10s

  rabbitmq:
    image: rabbitmq:3
    container_name: rabbitmq
    networks:
      - onlyoffice-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "status"]
      interval: 10s
      retries: 3
      start_period: 10s
      timeout: 10s
```
- **PostgreSQL**: A robust open-source object-relational database system.
- **RabbitMQ**: A popular message broker.

### Networks

Finally, we define the network that allows the containers to communicate with each other.

```yaml
networks:
  onlyoffice-network:
    driver: bridge
```
- The `onlyoffice-network` is a bridge network that Filebrowser, OnlyOffice, Postgres, and RabbitMQ use to communicate internally. `cloudflared` does not need to be on this network as it uses the host network.

## 3. Filebrowser Configuration

Next, create the configuration file for Filebrowser. This file, which we named `config.json`, controls various aspects of Filebrowser's behavior.

Paste the following into `config.json`:

```json
{
    "server": {
        "port": 80,
        "baseURL": "/",
        "internalUrl": "http://YOUR_SERVER_IP:80",
        "logging": {
            "levels": "info|warning|error",
            "output": "data/drive.log",
            "noColors": true
        },
        "sources": [
            {
                "path": "/srv/Home",
                "name": "Home",
                "config": {
                    "indexingIntervalMinutes": 5,
                    "disableIndexing": false,
                    "defaultUserScope": "/",
                    "defaultEnabled": true,
                    "createUserDir": true
                }
            }
        ]
    },
    "auth": {
        "adminUsername": "admin"
    },
    "userDefaults": {
        "darkMode": true,
        "viewMode": "list",
        "disableSettings": false,
        "singleClick": false,
        "dateFormat": true,
        "preview": {
            "disableHideSidebar": false,
            "highQuality": false,
            "image": true,
            "video": true,
            "motionVideoPreview": false,
            "office": false,
            "popup": false,
            "autoplayMedia": false
        },
        "permissions": {
            "api": false,
            "admin": false,
            "modify": false,
            "share": false,
            "realtime": false
        },
        "loginMethod": "password",
        "fileLoading": {
            "maxConcurrentUpload": 10,
            "uploadChunkSizeMb": 99
        },
        "disableOnlyOfficeExt": ".html .md .pdf .xps .epub .mobi .fb2 .cbz .svg .txt .hwp .hwpx"
    },
    "integrations": {
        "media": {
            "ffmpegPath": "/usr/local/bin"
        },
        "office": {
            "url": "https://docs.yourdomain.com",
            "internalUrl": "http://YOUR_SERVER_IP:81"
        }
    }
}
```
**Note**: You'll need to customize the `internalUrl` in both the `server` and `integrations.office` sections to match your server's local IP address. Also, change `integrations.office.url` to the public URL for your OnlyOffice instance (which we'll set up with Cloudflare).

## 4. Environment Variables

Create a `.env` file to store your secrets and environment-specific configurations.

```ini
# Cloudflare Tunnel Token
CLOUDFLARE_SECRET=YOUR_CLOUDFLARE_TUNNEL_TOKEN

# Filebrowser Config
FB_CONFIG=~/my-cloud/filebrowser/config.json
FB_DB=~/my-cloud/filebrowser/data/filebrowser.db
FB_PWD=your_strong_admin_password

# OnlyOffice JWT Secret
OFFICE_SECRET=your_strong_jwt_secret

# Timezone
TZ_ID=Asia/Jakarta
```

{{< admonition info "Info" >}}
For more available environment variables, you can refer to the [Filebrowser-Quantum environment-variables](https://filebrowserquantum.com/en/docs/reference/environment-variables/).
{{< /admonition >}}

## 5. Cloudflare Tunnel Configuration

1.  Go to the [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) dashboard.
2.  Navigate to `Nerworks` -> `Connectors`.
3.  `Create a tunnel`, give it a name, and select "Docker" as the connector.
4.  Copy the token provided and paste it into your `.env` file under `CLOUDFLARE_SECRET`.
5.  After creating the tunnel, go to the "Public Hostnames" tab and add hostnames for Filebrowser (e.g., `drive.yourdomain.com`) and OnlyOffice (e.g., `docs.yourdomain.com`).
    *   Point the Filebrowser hostname to the service `http://YOUR_SERVER_IP:80`.
    *   Point the OnlyOffice hostname to the service `http://YOUR_SERVER_IP:81`.

{{< admonition info "Info" >}}
For a more detailed guide, refer to the [official cloudflare-tunnel documentation](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/).
{{< /admonition >}}

## 6. Running the Stack

With all the configuration in place, you can now start all the services.

```bash
docker-compose up -d
```

This command will pull the necessary images and start all the containers in the background. You can check the logs to ensure everything is running correctly:

```bash
docker-compose logs -f
```

## Conclusion

You should now have a fully functional personal cloud accessible at the domain you configured in Cloudflare. You can log in to Filebrowser with the admin username (`admin` as per the config) and the password you set in the `.env` file. From there, you can create new users, manage your files, and edit documents with the integrated OnlyOffice suite.

This setup provides a secure and private alternative to commercial cloud storage, giving you full control over your data. Enjoy your new personal cloud!
