module.exports = {
    content: ['./docs/js/*.js', './docs/*.html', './docs/**/*.html', './docs/**/**/*.html',  './docs/**/**/**/*.html', './docs/**/**/**/**/*.html'],
    css: ['./docs/css/home.min.css'],
    safelist: {
      deep: [/lazyloaded$/, /blur$/],
      greedy: [/thumb$/]
    },
    blocklist: [ /search$/ ]
}
