# Instagram Shortcode in Hugo

Hugo it self has built-in Instagram shortcode supports, but for some reason it can't be used anymore. In this article i will write about how to solve this problem in your Hugo environment.
<!--more-->

## Instagram Shortcode
If you are using Instagram shortcode in Hugo and having an issue with it, you are not the only one. Using Instagram shortcode with `{{</* instagram "BWNjjyYFxVx" "hidecaption" */>}}` will generate an error like this:
```
Failed to get JSON resource "https://api.instagram.com/oembed/?url=https://instagram.com/p/BWNjjyYFxVx/&hidecaption=1": Failed to retrieve remote file: Bad Request
```

At the moment, Hugo using deprecated [oEmbed-legacy](https://developers.facebook.com/docs/instagram/oembed-legacy) linked API endpoint. Those deprecated API causes an error when Hugo retrieving the data. This is also happen with the _Hugo Continuous Integration_ build which force [Erik](https://bep.is/) to allow _getJSON errors_ to be ignored with this [commit](https://github.com/bep/hugo/commit/fdfa4a5fe62232f65f1dd8d6fe0c500374228788).

## Problem Solving
Facebook Developers lead us to use the newest Instagram [oEmbed](https://developers.facebook.com/docs/instagram/oembed) endpoint instead. This topic is being discused in [#7879](https://github.com/gohugoio/hugo/issues/7879). Using the newest API is required to create a Facebook App to generate _App ID_ and _Client Token_.

### Facebook App Configuration

1. Create an app in [Facebook Developers Page](https://developers.facebook.com/)
2. Add [_Instagram Graph API_](https://developers.facebook.com/docs/instagram-api/) and [_oEmbed_](https://developers.facebook.com/docs/plugins/oembed) to your facebook app
3. Don't forget to activate _oEmbed_ plugin
![Instagram Graph Api and oEmbed Plugins](facebook_plugins.webp "Instagram Graph Api and oEmbed Plugins")
4. Find and copy _App ID_ in top left corner and use it for `.Site.Params.instagram.appId`
5. Go to Settings > Advanced > Security
6. Copy _Client Token_ and use it for `.Site.Params.instagram.clientToken`
![Facebook App ID and Client Token](facebook_appid.webp "Facebook App ID and Client Token")

### Theme Configuration
After you get both _App ID_ and _Client Token, follow these instruction below:

1. Create an `instagram.html` in `YourProject/layouts/shortcodes`

   At this point we will integrate url query string parameter both Instagram Post and TV.
The `$type` parameter with `p` will stand for Instagram Post and `tv` for Instagram TV.

```html
{{- $ig := .Site.Params.instagram -}}
{{- $appId := .Site.Params.instagram.appId -}}
{{- $clientToken := .Site.Params.instagram.clientToken -}}
{{- if not $ig.privacy -}}
{{ $type := .Get 0 }}
{{ $id := .Get 1 }}
{{ $hideCaption := cond (eq (.Get 2) "hidecaption") "1" "0" }}
{{ with getJSON "https://graph.facebook.com/v10.0/instagram_oembed/?url=https://instagram.com/" $type "/" $id "/&hidecaption=" $hideCaption "&access_token=" $appId "|" $clientToken }}{{ .html | safeHTML }}{{ end }}
{{- end -}}
```

2. Add front matter in `config.toml`:
```toml
[params.instagram]
  appId = "YourAppId"
  clientToken = "YourClientToken"
  privacy = false
```

3. Create an example `instagram` input in your markdown:

   3.1. Sample input of Instagram Post
   
   ```markdown
   {{</* instagram "p" "BWNjjyYFxVx" "hidecaption" */>}}
   ```
   
   3.2. Sample input of Instagram TV
   
   ```markdown
   {{</* instagram "tv" "BkQUbR8h1sp" "hidecaption" */>}}
   ```

4. The rendered output will be like this:

   4.1. Sample output of Instagram Post
   
   {{< instagram "p" "BWNjjyYFxVx" "hidecaption" >}}

   4.2. Sample output of Instagram TV
   
   {{< instagram "tv" "BkQUbR8h1sp" "hidecaption" >}}

---
At last, you can enjoy to use Instagram shortcode in Hugo without any problems. Have a good day! :wink:

