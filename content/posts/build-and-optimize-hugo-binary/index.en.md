---
title: "Build and Optimize Hugo Binary"
subtitle: ""
date: 2023-06-14T13:10:30+07:00
lastmod: 2023-06-14T13:10:30+07:00
draft: false
author: "Khusika"
gravatarEmail: "khusikadhamar@gmail.com"
authorLink: ""
description: "See how to build and optimize hugo binary to your system"
resources:
- name: "featured-image"
  src: "featured-image.webp"

tags: [golang, hugo, upx]
categories: ["Blogs"]

toc:
  auto: true
math:
  enable: false
lightgallery: false
license: '<a rel="license external nofollow noopener noreffer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'
---
Let's see how to optimize Hugo size binary as small as possible.
<!--more-->

## About Go Optimization

Optimizing the sizes of Hugo binary may useful for saving your storage, especially if you keep this on a remote server. There are several articles mentioned that go binary can be optimized as small as possible. According to the [filippo.io](https://words.filippo.io/shrink-your-go-binaries-with-this-one-weird-trick/), we can use the `-s` and `-w` linker flags to strip the debugging and save almost 28% of sizes. [Petr Jahoda](https://petrjahoda.medium.com/) via [itnext.io](https://itnext.io/shrinking-go-executable-9e9c17b47a41) also mentioned that using [UPX](https://upx.github.io/) with `--best --lzma` parameter will reduce about 21% of the original size.

Based on those articles, we can apply it to optimize Hugo binary and save more sizes. Take a look into my tweet below:

{{< admonition warning "Update Jun 2025" >}}
The tweet has been removed as the original post is no longer available.
{{< /admonition >}}

## Install Required Packages

{{< admonition info "Info" >}}
I wrote this only for `linux/amd64` environment
{{< /admonition >}}

1. First of all, these are required packages to build Hugo binary:
 - [GoLang](https://go.dev/dl/)
 - [UPX](https://upx.github.io/)

2. Install required packages

   a. Setup GoLang
   ```bash
   wget https://go.dev/dl/go1.24.0.linux-amd64.tar.gz && sudo tar -C /usr/local -xzf go1.24.0.linux-amd64.tar.gz
   ```

   b. Setup UPX
   ```bash
   wget https://github.com/upx/upx/releases/download/v5.0.0/upx-5.0.0-amd64_linux.tar.xz && sudo tar -C /usr/local -xf upx-5.0.0-amd64_linux.tar.xz --transform 's/upx-5.0.0-amd64_linux/upx/'
   ```

3. Add all environment into `.profile`
   ```bash
   export PATH=$PATH:/usr/local/go/bin
   export PATH=$PATH:$HOME/go/bin
   export PATH=$PATH:/usr/local/upx
   ```

## Build Hugo Binary

1. Download latest Hugo source
   ```bash
   git clone https://github.com/gohugoio/hugo -b master && cd hugo
   ```

2. Export all required go environment
   ```bash
   export CGO_ENABLED="1"
   ```

3. Build go binary with `-s` and `-w` linker flags
   ```bash
   go install -ldflags="-s -w" --tags extended
   ```

4. Optimize Hugo binary with upx
   ```bash
   upx --best --lzma "$HOME/go/bin/hugo"
   ```

## Tips

If you want instant build, you can use my script below:
```bash
wget https://raw.githubusercontent.com/khusika/khusika.github.io/master/build && ./build
```
The output file will be in the `bin/$(go env GOARCH)/hugo`.

{{< admonition warning "Messages from UPX" >}}
False positive antivirus alerts of official UPX releases _(Windows only)_. [See #437](https://github.com/upx/upx/issues/437)
{{< /admonition >}}
