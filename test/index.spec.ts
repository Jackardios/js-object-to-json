import { jsObjectAsStringToJSON } from '../src';

describe('index', () => {
  describe('jsObjectAsStringToJSON', () => {
    it('should convert empty object to json', () => {
      expect(jsObjectAsStringToJSON('{}')).toEqual('{}');
    });

    it('should convert complex js object to json', () => {
      expect(
        jsObjectAsStringToJSON(`
{
  // some single line comment
  fooBar: 'baz',
  barBaz: 123,
  'bar-baz': false,
  "alex": true,
  "alex[name=\\"double-escaped\\"]": {
    someNested: [
      1,
      2,/*
        // inner comment
      */
      { "maxWidth": '123px', 'max-height': "value" },
    ],
    anotherNested: [1, 2,{}, 'foo', ''],
    /*

    another: [1, 2, 'foo','bar' {}, "hello"]
    'multiline comment'
  */
    fooBar: [1,2, false, true, 'some-"string"', 3,]
  },
  'alex[name=\\'single-escaped\\']': false,//
  "alex[name=\\'single-escaped\\']": [1,2,false,  ],//
  "alex[name='single-unescaped']": [1,2,3,false], // : ['some value'],
  'alex[name=\\"double-escaped\\"]': "some string val'ue",/**/
'alex[name="double-unescap\\'ed"]': "some string val'\\"u\\"'e",
  'alex[name="double-unescaped"]': "some string 'value'",
}
      `)
      ).toMatchSnapshot();
    });

    it('should throw an error when converting invalid js object to json', () => {
      expect(() => jsObjectAsStringToJSON('some invalid json')).toThrow(
        SyntaxError
      );
    });
  });
});
