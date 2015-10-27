(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SGF = factory();
  }
})(this, function () {

  function isWhitespace(c) {
    return /^\s$/.test(c);
  }

  function isEscape(c) {
    return /^\\$/.test(c);
  }

  function isAlpha(c) {
    return /^[a-zA-Z]$/.test(c);
  }

  function createSource(sgf) {
    var data = sgf.split('');
    var position = 0;

    function peek() {
      if (position >= data.length) {
        throw new Error('Unexpected end of input.');
      }
      return data[position];
    }

    function next() {
      position++;
      return position < data.length;
    }

    function skipws() {
      while (isWhitespace(peek()) && next());
    }

    return {
      peek: peek,
      next: next,
      skipws: skipws
    };
  }

  function parseIdent(source) {
    source.skipws();

    var ident = '';
    while (isAlpha(source.peek())) {
      ident += source.peek();
      source.next();
    }

    return ident;
  }

  function parseSingleValue(source) {
    source.skipws();

    source.next();
    var value = '';
    while (source.peek() != ']') {
      if (isEscape(source.peek())) {
        source.next();
      }

      value += source.peek();
      source.next();
    }

    source.next();
    return value;
  }

  function parseValue(source) {
    source.skipws();

    var values = [];
    while (source.peek() == '[') {
      var value = parseSingleValue(source);
      values.push(value);
      source.skipws();
    }
    return (values.length === 1) ? values[0] : values;
  }

  function parseProperty(source) {
    source.skipws();

    var ident = parseIdent(source);
    var value = parseValue(source);
    return {
      ident: ident,
      value: value
    };
  }

  function parseNode(source) {
    source.next();

    var node = {
      props: {},
      childs: []
    };

    while (true) {
      source.skipws();
      if (!isAlpha(source.peek())) {
        break;
      }

      var property = parseProperty(source);
      node.props[property.ident] = property.value;
    }

    return node;
  }

  function parseTree(source) {
    source.skipws();
    if (source.peek() !== '(') {
      throw new Error('Expected "(", got "' + source.peek() + '"');
    }
    source.next();

    var tree = null;
    var cursor = null;

    while (source.peek() !== ')') {
      switch (source.peek()) {
        case ';':
          var node = parseNode(source);

          if (cursor) {
            cursor.childs.push(node);
          } else {
            tree = node;
          }

          cursor = node;
          break;
        case '(':
          var node = parseTree(source);
          cursor.childs.push(node);
          break;
        default:
          if (!isWhitespace(source.peek())) {
            throw new Error('Malformed input.');
          }
          source.next();
          break;
      }
    }

    source.next();
    return tree;
  }

  function parse(sgf) {
    return parseTree(createSource(sgf));
  }

  return {
    parse: parse
  };
});
