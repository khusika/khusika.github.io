# WebP Image Processing in Hugo

WebP is a modern image format that provides superior lossless and lossy compression for images on the web. But for some reason, it is not supported in Hugo framework. In this section i would like to discuss about implementation of WebP in Hugo.
<!--more-->

## Why WebP?
There are several article mentioned that WebP provide a better quality and quantity for web image resources. According to the [Google Developers](https://developers.google.com/speed/webp), WebP lossless images are 26% smaller in size compared to PNGs. WebP lossy images are 25-34% smaller than comparable JPEG images at equivalent SSIM quality index. Lighthouse also mentioned in the [web.dev](https://web.dev/uses-webp-images/?utm_source=lighthouse&utm_medium=unknown) that, WebP have superior compression and quality characteristics compared to their older JPEG and PNG counterparts. For more details, you can read "_[WebP Compression Study](https://developers.google.com/speed/webp/docs/webp_study)_".

According to the [Caniuse](https://caniuse.com/?search=webp), currently more than 80% of browsers support the WebP image format. That would include Chrome, Firefox, Edge and Safari. Although not all browsers currently support the WebP image format, it's important to note that, if set up properly, your website's images won't appear broken for these browsers.

## WebP in Hugo
Based on the explanation above we can conclude that using WebP as default image resources is a good choice for Hugo. According to [ Hugo image processing documentation](https://gohugo.io/content-management/image-processing/#target-format), at this time only `jpg`, `png`, `tif`, `bmp`, and `gif` format images can be used in Hugo. But there is currently no WebP support for Hugo. This issue is being discussed at [#5924](https://github.com/gohugoio/hugo/issues/5924), [Erik](https://github.com/bep) mentioned that we need the implementation both decoder and encoder of WebP in GoLang dependency. The Go team itself already provides WebP package support but only the decoder without the encoder in [GoLang WebP Documentation](https://pkg.go.dev/golang.org/x/image/webp).

There is still way to force support WebP in Hugo. [Gregor Noczinski](https://github.com/blaubaer) invested something good about WebP implementation in Hugo via PR [#7155](https://github.com/gohugoio/hugo/pull/7155). He has added the webp encoding support and this change required to use [WebP binaries](https://developers.google.com/speed/webp/download) to be installed in your system. But this changed was rejected by [Erik](https://github.com/bep) because of no GoLang native WebP implementation available instead of using pre-built binaries or C-bindigs to acces the library.

If you wanted to use WebP encoding in Hugo, you can try to [build Hugo from source](https://gohugo.io/getting-started/installing/#source) with picking this PR [#7155](https://github.com/gohugoio/hugo/pull/7155) in your git-tree or download my pre-built binaries in the attachment below. You can use all the commands on the WebP image if you have WebP binaries installed on your system. For example, resizes all WebP images into a specific size:

```Code
{{ $imageResource := .Page.Resources.GetMatch "*.webp" }}
{{ $resized := $imageResource.Resize "300px" }}
{{ $resized.RelPermalink }}
```

{{< admonition info "Pre-built Hugo Binaries" false >}}
[:(far fa-file-archive fa-fw): Hugo v0.81.0-DEV/extended](hugo)
{{</ admonition >}}

