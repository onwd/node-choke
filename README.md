# node-choke

Detects whether the Node.js Event Loop has choked and what caused it to choke.

## Installation

```bash
$ npm i node-choke
```

## Example

```js
const choke = require('node-choke');

choke((info) => {
  console.log(`Event Loop has choked for ${info.dt}ns, stack trace:`, info.stack);
});
```
