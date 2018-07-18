# amlich.js

[![Version](https://img.shields.io/npm/v/amlich.js.svg)](https://npmjs.org/package/amlich.js)

A Vietnamese lunar calendar calculator library written in JavaScript.

Another version which is written in Haskell https://github.com/codeaholicguy/halunar.

### Usage

```js
computeDateToLunarDate(dd, mm, yy, timeZone) 
computeDateFromLunarDate(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone)
```

Example:

```js
const {computeDateToLunarDate} = require('amlich.js')

console.log(computeDateToLunarDate(18, 7, 2018, 7))
// { lunarDay: 6, lunarMonth: 6, lunarYear: 2018, lunarLeap: false }
```

### License

[MIT](LICENSE)

### Reference

[Computing the Vietnamese lunar calendar](https://www.informatik.uni-leipzig.de/~duc/amlich/calrules_en.html)
