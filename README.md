<h1 align="center">Welcome to v12-to-v13 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/alighamdan/v12-to-v13" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> convert discord.js v12 codes to v13

## Install

```sh
npm install v12-to-v13
```

## cli help page

```sh
v12-to-v13 --help
```

## api

```js
const { converter } = require('v12-to-v13').default;

// v12_code param is required
// with_Pretty is optional default is false
// prettier_Options is optional check:
// https://prettier.io/docs/en/api.html

converter(v12_Code, with_Pretty, prettier_Options);

// returns: object of three keys:
// key1: prettied: boolean
// key2: code: string
// key3: convertTime: number (time in ms)

// NOTE: prettied key can be false in some times if the result code have an error
```

## Authors

👤 **ali dev**

* Github: [@alighamdan](https://github.com/alighamdan)

👤 **Pudochu**
* Github: **[@pudochu](https://github.com/pudochu)**
* Discord: **[Cortex](https://discord.gg/cortex)**

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/alighamdan/v12-to-v13/issues). 

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_