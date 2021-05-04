module.exports = {
    content: ['./docs/js/*.js', './docs/*.html', './docs/**/*.html', './docs/**/**/*.html',  './docs/**/**/**/*.html', './docs/**/**/**/**/*.html'],
    css: ['./docs/css/*.css'],
    safelist: {
      deep: [/lazyloaded$/, /blur$/],
      greedy: [/thumb$/, /lazyloading$/, /instagram-media$/, /lg-icon$/, /kbd$/]
    },
    blocklist: [ /search$/ ]
}
