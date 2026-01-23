'use strict';

const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const vnuJar = require('vnu-jar');

const docsPath = path.resolve(__dirname, './docs');

if (!fs.existsSync(docsPath)) {
    console.error(`The directory "${docsPath}" does not exist. Exiting...`);
    process.exit(1);
}

execFile(
    'java',
    [
        '-jar',
        vnuJar,
        '--verbose',
        '--Werror',
        '--skip-non-html',
        '--also-check-css',
        '--errors-only',
        docsPath
    ],
    { shell: true },
    (error, stdout, stderr) => {
        if (error) {
            console.error('Validation failed:', stderr.trim());
            return;
        }
        console.log('Validation successful:', stdout.trim());
    }
);
