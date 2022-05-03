# Scrapper Extension

There are 5 directories and 3 script commands of interest.

## Directories

- extension-public
- extension-src
- public
- scripts
- src

### Extension Public

Where the chrome extension lives.

### Extension Src

Where typescript source files for the extension live.

### Public

Where the netlify front-end lives.

### Scripts

Where the scripts source and dist files live.

### Src

Where the typescript source files for the netlify front-end live.

## Script Commands

- start
- build
- scripts-build

### start

Run in start mode, hot-reload for building UI of netlify front-end and extension popup.

### build

Run in build mode, build for production, tree shaking, css minification, etc.

### scripts-build

Rebuild the scripts for start and build. Used after changing scripts/src/\*_/_.ts
