---
title: "Things I Do On Focal Fossa"
subtitle: ""
date: 2020-09-19T08:57:07+07:00 
draft: false
author: "Khusika"
description: "Things I Do On Focal Fossa"
resources:
- name: "featured-image"
  src: "featured-image.png"

tags: ["ubuntu"]
categories: ["blogs"]

toc:
  auto: false
math:
  enable: false
lightgallery: false
license: ""
---

Ubuntu 20.04 was released on 2020 and it brings plenty of new features. In this article, i will share some of Focal Fossa configuration for personal use.
<!--more-->

## Hide The User Login List
Hiding this feature is good choice if you want to increase security on the login screen. I always do this since Ubuntu 14.04. According to the [tipsonubuntu.com](https://tipsonubuntu.com/2020/05/21/hide-user-list-ubuntu-20-04-login-screen/), this is the only way to hide the user list in login screen of Focal Fossa which is different to the older version of Ubuntu.

1. Hiding the User List
The main instruction is to disable-user-list in gnome.login-screen. In short, just copy the command below in your Terminal 
```bash
sudo -i
xhost +SI:localuser:gdm
su gdm -l -s /bin/bash
export DISPLAY=:0
gsettings set org.gnome.login-screen disable-user-list true
```
2. Restore to the default changes
```bash
sudo -i
xhost +SI:localuser:gdm
su gdm -l -s /bin/bash
export DISPLAY=:0
gsettings reset org.gnome.login-screen disable-user-list
```

## Hide GRUB Menu Selection
This is the most important for me if you are using dual boot in your PC. In my opinion, boot selection in every boot will cost time about 10-30s at the boot time. This can be done by disabling OS Prober in _/etc/default/grub_ with _GRUB_DISABLE_OS_PROBER_. According to the [ubuntu community](https://help.ubuntu.com/), this entry is used to prevent GRUB from adding the results of os-prober to the menu. A value of "true" disables the os-prober check of other partitions for operating systems, including Windows, Linux, OSX and Hurd, during execution of the update-grub command.

1. First of all you need to open Terminal then follow this command below
```bash
sudo -H gedit /etc/default/grub
```
2. Then add this flag below on any line, after that save the file & exit
```markdown
GRUB_DISABLE_OS_PROBER=true
```
3. Back to the Terminal, then update the grub setting
```bash
sudo update-grub
```

## Windows Like "click-action"
This config is good if you want Ubuntu docks looks like Windows. You can set it manually from Terminal then type this command below.
```bash
gsettings set org.gnome.shell.extensions.dash-to-dock click-action 'minimize-or-overview'
```

You can revert to the default option by running this command below.
```bash
gsettings reset org.gnome.shell.extensions.dash-to-dock click-action
```

## Hide Home Folder & Trash Icons from Desktop
In Ubuntu 20.04, the home folder and trash icon are displayed on the desktop by default. For those who like to see a clean desktop from these two icons, do the steps below in Terminal.

1. This command below will hide home folder icon from the desktop
```bash
gsettings set org.gnome.shell.extensions.desktop-icons show-home false
```

2. This command below will hide trash icon from the desktop
```bash
gsettings set org.gnome.shell.extensions.desktop-icons show-trash false
```

You can revert to the default option by running this commands below.
```bash
gsettings reset org.gnome.shell.extensions.desktop-icons show-home
gsettings reset org.gnome.shell.extensions.desktop-icons show-trash
```

## References
- [Tips on Ubuntu](https://tipsonubuntu.com/), 2020. **[[Quick Fix] Hide the User List in Ubuntu 20.04 Login Screen](https://tipsonubuntu.com/2020/05/21/hide-user-list-ubuntu-20-04-login-screen/)**.
- [Ubuntu Community](https://help.ubuntu.com/), 2019. **[Grub2/Setup](https://help.ubuntu.com/community/Grub2/Setup)**.
