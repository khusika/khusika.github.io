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

This post documents how the Windows Update error Install error - `0x80072f8f` was resolved during an in-place repair. The instructions below describe the troubleshooting steps performed and the final solution that worked without losing apps or personal data.

## Problem
While updating Windows Insider (beta) build _22631.2338_ the installer stalled at 99% with the error code `0x80072f8f`. Multiple attempts to clear the update cache and repair system components did not fix the issue. Logs were not reproducible, so it was unclear whether files were corrupted during download or something blocked the installation step.

![Install error - 0x80072f8f](error-pict.webp "Install error - 0x80072f8f")

The following commands were executed to stop update services, reset caches and re-register components, then to run component and system file checks:

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

These steps did not resolve the error; the update still failed.

## Solution

Because the typical repair steps did not help, an in-place upgrade (repair install) was performed using a Windows ISO. This preserves installed applications and personal files while reinstalling Windows system components. Since Insider builds do not always provide official ISOs, an updated ISO was created using UUP Dump.

## Resources and references

- Repair instructions used: [Repair Install Windows 11 with an In-place Upgrade](https://www.elevenforum.com/t/repair-install-windows-11-with-an-in-place-upgrade.418/#Two)
- How to obtain an updated ISO: [How to use UUP dump to create an updated Windows ISO for any channel](https://www.xda-developers.com/uup-dump-windows-11-10-iso-update/)

## Outcome

After performing the in-place upgrade using an ISO built from UUP Dump, the `0x80072f8f` error no longer appeared and Windows Update completed successfully on subsequent updates.

## Notes

- An in-place upgrade is best used when other repair methods fail and when preserving apps and files is important.
- Always back up critical data before performing major system operations.
- If preferred, test the ISO in a virtual machine before applying to the primary system.
