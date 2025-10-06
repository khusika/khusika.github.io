const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

(async () => {
    const contentPaths = [
        './docs/js/*.js',
        './docs/*.html',
        './docs/**/*.html',
        './docs/**/**/*.html',
        './docs/**/**/**/*.html',
        './docs/**/**/**/**/*.html'
    ];

    const purgeCSSConfig = {
        content: contentPaths,
        css: ['./docs/css/*.css'],
        safelist: {
            deep: [/lazyloaded$/, /blur$/, /markdown-body$/, /target$/, /path$/],
            greedy: [/thumb$/, /lazyloading$/, /instagram-media$/, /lg-icon$/, /kbd$/, /fb_iframe_widget$/]
        },
        blocklist: [/search$/]
    };

    const purgeFontConfig = {
        content: contentPaths,
        css: ['./docs/lib/fontawesome-free/all.min.css']
    };

    const purgeCSSResult1 = await new PurgeCSS().purge(purgeCSSConfig);
    purgeCSSResult1.forEach((result) => {
        const outputPath = path.join('./docs/css/', path.basename(result.file));
        fs.writeFileSync(outputPath, result.css, 'utf-8');
        console.log(`Purged CSS written to ${outputPath}`);
    });

    const purgeCSSResult2 = await new PurgeCSS().purge(purgeFontConfig);
    purgeCSSResult2.forEach((result) => {
        const outputPath = path.join('./docs/lib/fontawesome-free/', path.basename(result.file));
        fs.writeFileSync(outputPath, result.css, 'utf-8');
        console.log(`Purged Font CSS written to ${outputPath}`);
    });
})();
