# SGF parser

Simple [SGF](https://en.wikipedia.org/wiki/Smart_Game_Format) parser for node and browser.

## Usage

```javascript
var SGF = require('sgfjs');

var parsed = SGF.parse('your sgf here');
```

For the following sgf:

```
(;FF[4]GM[1]SZ[19];B[aa];W[bb]
  (;B[cc]N[Var A];W[dd])
  (;B[gg]N[Var C];W[gh];B[hh]))
```

Resulting object will be:

```javascript
{
  props: {
    FF: "4",
    GM: "1",
    SZ: "19"
  },
  childs: [{
    props: {
      B: "aa"
    },
    childs: [{
      props: {
        W: "bb"
      },
      childs: [{
        props: {
          B: "cc",
          N: "Var A"
        },
        childs: [{
          props: {
            W: "dd"
          },
          childs: []
        }]
      }, {
        props: {
          B: "gg",
          N: "Var C"
        },
        childs: [{
          props: {
            W: "gh"
          },
          childs: [{
            props: {
              B: "hh"
            },
            childs: []
          }]
        }]
      }]
    }]
  }]
}
```

## License

The MIT License (MIT)
