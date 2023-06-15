---
title: "Build and Optimize Hugo Binary"
subtitle: ""
date: 2023-06-14T13:10:30+07:00
lastmod: 2023-06-14T13:10:30+07:00
draft: false
author: "Khusika"
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

Based on those articles, we can apply it to optimize Hugo binary and save more sizes. I've tested it with `llvm-16` as replacement of `CC`, `C++`, and `AR` compiler which is used to compile Hugo extended version. Take a look into my tweet below:

{{< oembed "tweet" "https://twitter.com/khusikadhamar/status/1656515579816321024" >}}

## Install Required Packages

> I wrote this only for `linux/amd64` environment

1. First of all, these are required packages to build Hugo binary:
 - [GoLang](https://go.dev/dl/) _Use go1.20.x_
 - [llvm](https://apt.llvm.org/) _Use llvm-16_
 - [UPX](https://upx.github.io/)

2. Install required packages

   a. Setup GoLang
   ```bash
   wget https://go.dev/dl/go1.20.5.linux-amd64.tar.gz && sudo tar -C /usr/local -xzf go1.20.5.linux-amd64.tar.gz
   ```

   b. Setup llvm-16
   ```bash
   wget wget https://apt.llvm.org/llvm.sh && sudo ./llvm.sh 16
   ```

   c. Setup UPX
   ```bash
   wget https://github.com/upx/upx/releases/download/v4.0.2/upx-4.0.2-amd64_linux.tar.xz && sudo tar -C /usr/local -xvf upx-4.0.2-amd64_linux.tar.xz && sudo mv /usr/local/upx-4.0.2-amd64_linux /usr/local/upx
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
   export CGO_ENABLED="1" AR="llvm-ar-16" CC="clang-16" CXX="clang++-16"
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