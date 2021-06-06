module.exports = {
    content: ['./docs/js/*.js', './docs/*.html', './docs/**/*.html', './docs/**/**/*.html',  './docs/**/**/**/*.html', './docs/**/**/**/**/*.html'],
    css: ['./docs/css/*.css'],
    safelist: {
      deep: [/lazyloaded$/, /blur$/, /vssue$/, /markdown-body$/],
      greedy: [/thumb$/, /lazyloading$/, /instagram-media$/, /lg-icon$/, /kbd$/, /fb_iframe_widget$/]
    },
    blocklist: [ /search$/ ]
}
