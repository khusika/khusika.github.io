---
title: "Introduction of Canting Kernel"
subtitle: ""
date: 2020-06-14T20:14:17+07:00
draft: false
author: "Khusika"
description: "Canting is a kernel based on Google Common merged over CAF."
resources:
- name: "featured-image"
  src: "featured-image.webp"

tags: ["android", "kernel"]
categories: ["Projects"]

toc:
  auto: false
math:
  enable: false
lightgallery: false
license: 'Published under <a rel="license external nofollow noopener noreffer" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>'
---
Canting is an android kernel based on Google kernel-common merged over CAF-kernel. Built to provide security and stability improvement. _Canting_ it self is a pen-like instrument used in the process of _batik_ making.
<!--more-->

## Source Codes
### xiaomi-msm8953
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/khusika/canting_kernel_xiaomi_msm8953?style=flat-square)](https://github.com/khusika/canting_kernel_xiaomi_msm8953/releases/latest)[![Total Stars](https://img.shields.io/github/stars/khusika/canting_kernel_xiaomi_msm8953?style=flat-square)](https://github.com/khusika/canting_kernel_xiaomi_msm8953/stargazers)[![Total Forks](https://img.shields.io/github/forks/khusika/canting_kernel_xiaomi_msm8953?style=flat-square)](https://github.com/khusika/canting_kernel_xiaomi_msm8953/network/members)[![Issues](https://img.shields.io/github/issues/khusika/canting_kernel_xiaomi_msm8953?style=flat-square)](https://github.com/khusika/canting_kernel_xiaomi_msm8953/issues)

### xiaomi-sdm845
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/khusika/canting_kernel_xiaomi_sdm845?style=flat-square)](https://github.com/khusika/canting_kernel_xiaomi_sdm845/releases/latest)[![Total Stars](https://img.shields.io/github/stars/khusika/canting_kernel_xiaomi_sdm845?style=flat-square)](https://github.com/khusika/canting_kernel_xiaomi_sdm845/stargazers)[![Total Forks](https://img.shields.io/github/forks/khusika/canting_kernel_xiaomi_sdm845?style=flat-square)](https://github.com/khusika/canting_kernel_xiaomi_sdm845/network/members)[![Issues](https://img.shields.io/github/issues/khusika/canting_kernel_xiaomi_sdm845?style=flat-square)](https://github.com/khusika/canting_kernel_xiaomi_sdm845/issues)

## Features
* Upstream with latest [linux-stable](https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/) releases
* Upstream with latest [CAF-kernel](https://source.codeaurora.org/quic/la/kernel) releases
* Clang supported
* CPU Governors: schedutil, powersave, performance
* I/O Schedulers: noop, cfq
* Compat vDSO from Pixel kernel
* TCP Congestion Algorithm: bbr, westwood, reno, cubic
* [WireGuard](https://forum.xda-developers.com/t/wireguard-kernel-rom-integration.3711635/) VPN support
* Boeffla wakelock blocker
* [Simple Low Memory Killer](https://github.com/kerneltoast/simple_lmk)
* Sound Control: Speaker, Microphone, Headphone (Per-channel control)
* KCAL & KLapse Interface
* Vibration Intensity Control
* backlight min option
* Removed safetynet flags (no need of magisk to bypass safteynet)
* Extend File System Support: F2FS, EXFAT, NTFS
* and many more

## Device Support
### canting-3.18.y
* ~~**MSM8953**~~ _abandoned_
  * [Redmi Note 4X](https://forum.xda-developers.com/redmi-note-4/xiaomi-redmi-note-4-snapdragon-roms-kernels-recoveries--other-development/kernel-canting-0-1-t3865604)
  * [Mi A1](https://forum.xda-developers.com/mi-a1/development/kernel-canting-0-1-t3865600)

### canting-4.9.y
* **MSM8953**
  * [Mi A1](https://forum.xda-developers.com/mi-a1/development/kernel-canting-0-1-t3871134)
* **SDM845**
  * [canting-4.9 for Mi 8](https://forum.xda-developers.com/mi-8/development/kernel-canting-0-1-t3907882)
  * [canting-4.9 for Mi Mix 2S](https://forum.xda-developers.com/xiaomi-mi-mix-2s/development/kernel-canting-0-1-t3907884)
  * [canting-4.9 for Poco F1](https://forum.xda-developers.com/poco-f1/development/kernel-canting-0-1-t3907883)

## How to Build
This section describes how to set up your local work environment to build the Canting Kernel. You must use Ubuntu/Debian.
### Set-up Environment
1. Instal required packaged for Ubuntu based distro, according to the [source.android.com](https://source.android.com/setup/build/initializing#installing-required-packages-ubuntu-1404) and [xda-developers.com](https://forum.xda-developers.com/chef-central/android/guide-how-to-build-android-kernel-t3654336). Install the following packaged:
```bash
sudo apt-get install git ccache automake lzop bison gperf build-essential zip curl zlib1g-dev zlib1g-dev:i386 g++-multilib python-networkx libxml2-utils bzip2 libbz2-dev libbz2-1.0 libghc-bzlib-dev squashfs-tools pngcrush schedtool dpkg-dev liblz4-tool make optipng
```
2. Clone the kernel trees
For an example, we are going to build canting-4.9.q for sdm845 into _canting_ as directiories:
```bash
git clone https://github.com/khusika/canting_kernel_xiaomi_sdm845 -b canting-4.9-q canting
```
&nbsp;
3. Clone required toolchain, at this point only Clang with prebuilt binutils(arm and arm64) in it to build canting-kernel.
```bash
git clone https://github.com/khusika/prebuilt_google_clang -b master clang-toolchain
```
### Compile Kernel 
1. Make sure to clean the kernel trees
```bash
make clean && make mrproper
```
&nbsp;
2. Export required crosscompile, [previously](#set-up-environment) we use prebuilt google-clang.
```bash
export CC='/clang-toolchain/bin/clang'
export CLANG_TRIPLE=aarch64-linux-gnu-
export CLANG_TRIPLE_ARM32=arm-linux-gnueabi-
export CROSS_COMPILE='/clang-toolchain/bin/aarch64-linux-gnu-'
export CROSS_COMPILE_ARM32='/clang-toolchain/bin/arm-linux-gnueabi-'
export KBUILD_COMPILER_STRING="$('/clang-toolchain/bin/clang' --version | head -n 1 | perl -pe 's/\((?:http|git).*?\)//gs' | sed -e 's/  */ /g')"
```
&nbsp;
3. Make the device config and build the kernel, at this point we will build dipper kernel.
```bash
make O=out ARCH=arm64 canting-dipper_defconfig
make -j$(nproc --all) O=out
```
## Repack Kernel Image
At this point, we are going to repack the kernel image into flashable kernel.zip. There is a powerfull flashable.zip made by [Chris Renshaw](https://github.com/osm0sis) called [AnyKernel](https://github.com/osm0sis/AnyKernel3). All of [supported](#device-support) kernel are able to use those flashable.zip, just follow this guides:
1. Clone [Canting-AnyKernel](https://github.com/khusika/AnyKernel3) repository, for an example we use dipper branch
```bash
git clone https://github.com/khusika/AnyKernel3 -b dipper canting-kernel-dipper
```
&nbsp;
2. Copy or move the kernel images into the AnyKernel directories
```bash
cp '/canting/out/arch/arm64/boot/Image.gz-dtb' '/canting-kernel-dipper'
```
&nbsp;
3. Compress the kernel using zip
```bash
zip -r9 kernel.zip * -x README.md kernel.zip
```
## References
- [Albe96](https://forum.xda-developers.com/member.php?u=7334959), 2017. **[How To Build Android Kernel With Features](https://forum.xda-developers.com/chef-central/android/guide-how-to-build-android-kernel-t3654336)**.
- [Android Open Source Project](https://source.android.com/), 2020. **[Establishing a Build Environment](https://source.android.com/setup/build/initializing#installing-required-packages-ubuntu-1404)**.
- [Nathanchance](https://forum.xda-developers.com/member.php?u=6842057), 2017. **[How to compile an Android kernel](https://forum.xda-developers.com/android/software-hacking/reference-how-to-compile-android-kernel-t3627297)**.
