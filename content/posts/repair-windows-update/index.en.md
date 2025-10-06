---
title: "Repair Windows Update"
subtitle: ""
date: 2023-11-07T07:09:05+07:00
lastmod: 2023-11-07T07:09:05+07:00
draft: false
author: "Khusika"
authorLink: ""
description: "Fix your Windows update"
resources:
- name: "featured-image"
  src: "featured-image.webp"

tags: [windows, insider]
categories: ["Blogs"]

toc:
  enable: false
math:
  enable: false
lightgallery: true
license: '<a rel="license external nofollow noopener noreffer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'
---
Fixing my Windows Insider (beta) update, espescially with Install error - 0x80072f8f.
<!--more-->

Hello everyone! if you are coming to this article, i bet you are having a problem related to your Windows update. In my case, I was getting the error `Install error - 0x80072f8f` which would stop after 99% of the installation process.
![Install error - 0x80072f8f](error-pict.webp "Install error - 0x80072f8f")

I'm not sure what is causing this problem (i can't reproduce the logs), perhaps the file was corrupted during the download process or something is missing on my Windows.

At that time, my Windows was on `22631.2338` (beta) in September. I have done several times to clear every Windows Update cache and data by performing the commands below.

```bash
net stop wuauserv
net stop cryptSvc
net stop bits
net stop msiserver
net stop appidsvc
ren C:\Windows\SoftwareDistribution SoftwareDistribution.old
ren C:\Windows\System32\catroot2 catroot2.old
regsvr32.exe /s atl.dll
regsvr32.exe /s urlmon.dll
regsvr32.exe /s mshtml.dll
netsh winsock reset
netsh winsock reset proxy
rundll32.exe pnpclean.dll,RunDLL_PnpClean /DRIVERS /MAXCLEAN
dism /Online /Cleanup-image /ScanHealth
dism /Online /Cleanup-image /CheckHealth
dism /Online /Cleanup-image /RestoreHealth
dism /Online /Cleanup-image /StartComponentCleanup
Sfc /ScanNow
net start wuauserv
net start cryptSvc
net start bits
net start msiserver
net start appidsvc
```

Those commands did not solve my problem. `0x80072f8f` is still exist in every beta release. I assumed that the downloaded Windows Update file was actually fine and not corrupted, but something was blocking it when Windows Update tried to install the file onto my Windows.

So, the only way is to do an _in-place upgrade_. I choose this method because I wanted to fix it without losing my apps and personal data. Windows ISO is also required to be able to perform _in-place upgrade_. Since Windows does not release an ISO for Windows Insider program, i downloaded it using [UUP Dump](https://uupdump.net/) which is easy to use for me. By doing _in-place upgrade_ it has solved my problem, now there are no issues with my Windows Updates.

Read this article for the instructions:
- [Repair Install Windows 11 with an _In-place Upgrade_](https://www.elevenforum.com/t/repair-install-windows-11-with-an-in-place-upgrade.418/#Two).
- [How to use UUP dump to create an updated Windows ISO for any channel](https://www.xda-developers.com/uup-dump-windows-11-10-iso-update/).
