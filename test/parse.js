var fs = require('fs');
var glob = require('glob');
var expect = require('chai').expect;
var SGF = require('../');


var sgfs = glob.sync(__dirname + '/data/*.sgf').map(function (filename) {
  var outputFilename = filename.replace(/\.sgf$/, '_output.json');
  var input = fs.readFileSync(filename).toString();
  var output = require(outputFilename);

  return {
    input: input,
    output: output
  };
});

describe('SGF', function () {
  describe('parse', function () {
    it('should be a function', function () {
      expect(SGF.parse).to.be.an('function');
    });

    it('should parse sgf input to javascript object', function () {
      sgfs.forEach(function (item) {
        expect(SGF.parse(item.input)).to.eql(item.output);
      });
    });

    it('should throw an error for malformed input', function () {
      var malformedInputs = [
        '(;FF[4)',
        ';()',
        '(;FF[4]])'
      ];
      malformedInputs.forEach(function (sgf) {
        expect(SGF.parse.bind(SGF, sgf)).to.throw();
      });
    });
  });
});
