import { parse } from '../src';

describe('index', () => {
  describe('parse', () => {
    it('should parse empty json', () => {
      expect(parse('{}')).toMatchObject({});
    });

    it('should parse json with any-quoted strings', () => {
      expect(
        parse(`{
          "double \`quoted\` 'string' \\"with \\"escaped quotes \\"": 'single \`string\` "string" \\'with \\'escaped quotes \\'',
          'single \`string\` "string" \\'with \\'escaped quotes \\'': "double \`quoted\` 'string' \\"with \\"escaped quotes \\"",
          ["double \`quoted\` 'string' \\"with \\"escaped quotes \\" in square quoted key"]: ['single \`string\` "string" \\'with \\'escaped quotes \\''],
          ['single \`string\` "string" \\'with \\'escaped quotes \\' in square quoted key']: ["double \`quoted\` 'string' \\"with \\"escaped quotes \\""],
          [\` "multi-line"
          \\\${Template string} 'key"
          \\\` inner escaped ' string
          '''"
    \\\` 
\`]: \`single-line \\\${"Template 'string} value'" \\\` inner escaped string \`,
          [\`single-line \\\${Template string} key \\\` inner escaped string \`] : \`
  "multi-line"
          \\\${Template string} 'value"
    \\\` inner escaped ' string
      \\\` 
      '''"
\`,
          "nested\\"-object test": {
            '': [\`single-line "Template 'string value'" \\\` inner escaped string \`,"double \`quoted\` 'string' \\"with \\"escaped quotes \\"",'single \`string\` "string" \\'with \\'escaped quotes \\''],
            'multiline "array"' : [
              \`single-line "Template 'string value'" \\\` inner escaped string \`,
              "double \`quoted\` 'string' \\"with \\"escaped quotes \\"",
              'single \`string\` "string" \\'with \\'escaped quotes \\'',
            ]
          },
          [\`\`]: [\`single-line "Template 'string value'" \\\` inner escaped string \`]
        }`)
      ).toMatchObject({
        'double `quoted` \'string\' "with "escaped quotes "':
          "single `string` \"string\" 'with 'escaped quotes '",
        "single `string` \"string\" 'with 'escaped quotes '":
          'double `quoted` \'string\' "with "escaped quotes "',
        'double `quoted` \'string\' "with "escaped quotes " in square quoted key':
          ["single `string` \"string\" 'with 'escaped quotes '"],
        "single `string` \"string\" 'with 'escaped quotes ' in square quoted key":
          ['double `quoted` \'string\' "with "escaped quotes "'],
        " \"multi-line\"\n          ${Template string} 'key\"\n          ` inner escaped ' string\n          '''\"\n    ` \n":
          'single-line ${"Template \'string} value\'" ` inner escaped string ',
        'single-line ${Template string} key ` inner escaped string ':
          "\n  \"multi-line\"\n          ${Template string} 'value\"\n    ` inner escaped ' string\n      ` \n      '''\"\n",
        'nested"-object test': {
          '': [
            'single-line "Template \'string value\'" ` inner escaped string ',
            'double `quoted` \'string\' "with "escaped quotes "',
            "single `string` \"string\" 'with 'escaped quotes '",
          ],
          'multiline "array"': [
            'single-line "Template \'string value\'" ` inner escaped string ',
            'double `quoted` \'string\' "with "escaped quotes "',
            "single `string` \"string\" 'with 'escaped quotes '",
          ],
        },
        '': ['single-line "Template \'string value\'" ` inner escaped string '],
      });
    });

    it('should throw an error when parsing json with template string with interpolations', () => {
      expect(() => {
        parse('{[`some ${Template string} value`]: "hello"}');
      }).toThrow(SyntaxError);

      expect(() => {
        parse('{[`$some {`Template string` value}`]: "hello"}');
      }).toThrow(SyntaxError);

      expect(() => {
        parse('{"hello": `some ${Template string} value`}');
      }).toThrow(SyntaxError);

      expect(() => {
        parse('{"hello": `$some {`Template string` value}`}');
      }).toThrow(SyntaxError);
    });

    it('should parse json with unquoted properties', () => {
      expect(
        parse(`{
          foo: "bar",
          foo_bar: 123,
          foo_123BAr_456_BAZ: 1234,
          bar1Baz2: "baz bat"
        }`)
      ).toMatchObject({
        foo: 'bar',
        foo_bar: 123,
        foo_123BAr_456_BAZ: 1234,
        bar1Baz2: 'baz bat',
      });
    });

    it('should throw an error when parsing json with unquoted properties with invalid characters', () => {
      expect(() => {
        parse(`{
          foo bar: "bar"
        }`);
      }).toThrow(SyntaxError);

      expect(() => {
        parse(`{
          foo-bar: "bar"
        }`);
      }).toThrow(SyntaxError);

      expect(() => {
        parse(`{
        тест: "bar"
      }`);
      }).toThrow(SyntaxError);
    });

    it('should parse json with comments', () => {
      expect(
        parse(`{
          "foo": "/* some string */", /*
          multiline comment
          some another: \`\`,
          // single-line comment inside multiline comment
          /* /* multiline comment inside multiline comment 
          */ /**/
          "bar": "// some string" // inline comment
          /* "foobar": "Baz", */
        }`)
      ).toMatchObject({
        foo: '/* some string */',
        bar: '// some string',
      });
    });

    it('should parse json with trailing commas', () => {
      expect(
        parse(`{
          "some array": [1,2, /* some comment
          */
          ],
          "nested object": {
            "element": 123,
            "another": {
              "another array": [1,2,3,],
              "some value": false, // 
            },
            "nested array": [1,2,[3,{"some":"value[1,2,3,]{1,'23',}",},4,[5,6,/* some comment */],],],
          },
        }`)
      ).toMatchObject({
        'some array': [1, 2],
        'nested object': {
          element: 123,
          'nested array': [
            1,
            2,
            [
              3,
              {
                some: "value[1,2,3,]{1,'23',}",
              },
              4,
              [5, 6],
            ],
          ],
        },
      });
    });

    it('should parse json with all tollerances(single quote strings, template strings, unquoted properties, comments and trailing commas)', () => {
      expect(
        parse(`{
          "double \`quoted\` 'string' \\"with \\"escaped quotes \\"": 'single \`string\` "string" \\'with {1,"23",} \\'escaped quotes \\'',
          'single \`string\` "string" \\'with \\'escaped quotes \\'': "double \`quoted\` 'string' \\"with \\"escaped quotes \\" [1,2,3,]",
          ["double \`quoted\` 'string' \\"with \\"escaped quotes \\" in square quoted key"]: [
            {
              foo_123BAr_456_BAZ: 'single \`string\` "string" /* \\'with \\'escaped quotes */ \\'',
              [/**/'single \`string\` "string" \\'with \\'escaped quotes \\' in // square quoted key']: ['single \`string\` "string" \\'with \\'escaped quotes \\'', "double \`quoted\` 'string' \\"with \\"escaped quotes \\"",], // some comment
            },
            1234,
            {
              fooBar: "double \`quoted\` 'string' \\"with \\"escaped quotes \\"",
              "/* some string */": false,
              qwerty1234: "/* some string */", /*
               some multiline comment
              */
            }, // testing comment
          ],
          [\` "multi-line"
          \\\${Template string} 'key"
          \\\` inner escaped ' string
          '''"
    \\\` 
\`]: \`single-line \\\${"Template 'string} value'" \\\` inner escaped string \`,
          [\`single-line \\\${Template string} key \\\` inner escaped string \`/* some comment */] : \`
  "multi-line"
          \\\${Template string} 'value"
    \\\` inner escaped ' string
      \\\` 
      '''"
\`,
          "nested\\"-object test {1,'23',}": {
            '': [\`single-line "Template 'string value'" \\\` inner escaped string \`,"double \`quoted\` 'string' \\"with \\"escaped quotes \\"",'single \`string\` "string" \\'with \\'escaped quotes \\'' //some comment ]
          ],
            'multiline "array"' : [/*
              multiline comment
              some another: \`\`,
              // single-line comment inside multiline comment [1,2,3,]
              /* /* multiline comment inside multiline comment {1,'23',}
              */ /**/
              \`single-line "Template 'string value'" \\\` inner escaped string \`, // some single line comment
              "double \`quoted\` 'string' \\"with \\"escaped quotes \\"", /*
                some multi-line comment
              */
              'single \`string\` "string" \\'with \\'escaped quotes \\'',
            ]
          },
          [\`\`]: [\`single-line "Template 'string value'" \\\` inner escaped string \`]
        }`)
      ).toMatchObject({});
    });

    it('should throw an error when parsing empty string', () => {
      expect(() => {
        parse('');
      }).toThrow(SyntaxError);
    });

    it('should throw an error when parsing invalid json', () => {
      expect(() => {
        parse('some invalid json');
      }).toThrow(SyntaxError);
    });
  });
});
