const singleQuotesStringRegExp =
  /(?<!\\)(?<singleQuotesString>'(?:\\'|[^'\n])*?')/;

const doubleQuotesStringRegExp =
  /(?<!\\)(?<doubleQuotesString>"(?:\\"|[^"\n])*?")/;

const templateStringRegExp =
  /(?<!\\)(?<templateString>`(?:\\`|(?:(?<!\\)\$\{.*?\})|[^`])*?`)/;

const singleQuotesStringSBKeyRegExp = new RegExp(
  `\\[\\s*${singleQuotesStringRegExp.source.replace(
    /<singleQuotesString>/g,
    '<singleQuotesStringSBKey>'
  )}\\s*\\](?=\\s*:)`
);

const doubleQuotesStringSBKeyRegExp = new RegExp(
  `\\[\\s*${doubleQuotesStringRegExp.source.replace(
    /<doubleQuotesString>/g,
    '<doubleQuotesStringSBKey>'
  )}\\s*\\](?=\\s*:)`
);

const templateStringSBKeyRegExp = new RegExp(
  `\\[\\s*${templateStringRegExp.source.replace(
    /<templateString>/g,
    '<templateStringSBKey>'
  )}\\s*\\](?=\\s*:)`
);

const unquotedPropertyRegExp = /(?<propertyName>\w+)(?:\n|\s)*(?=:)/;
const singleLineCommentRegExp = /\/\/.*/;
const multiLineCommentRegExp = /\/\*(?:.|\n)*?\*\//;
const trailingCommaRegExp = /,(?<trailingBracket>(?:\s|\n)*?(?:}|]))/;

const tokensUnionRegExp = [
  singleQuotesStringSBKeyRegExp.source,
  doubleQuotesStringSBKeyRegExp.source,
  templateStringSBKeyRegExp.source,
  singleQuotesStringRegExp.source,
  doubleQuotesStringRegExp.source,
  templateStringRegExp.source,
  unquotedPropertyRegExp.source,
  singleLineCommentRegExp.source,
  multiLineCommentRegExp.source,
  trailingCommaRegExp.source,
].join('|');

const tokensRegExp = new RegExp(`(?:${tokensUnionRegExp})`, 'g');

export function parse(looseJSON: string): ReturnType<typeof JSON.parse> {
  const normalized = looseJSON
    .replace(tokensRegExp, match => {
      // remove all comments first
      if (match.startsWith('//') || match.startsWith('/*')) {
        return '';
      }
      return match;
    })
    .replace(tokensRegExp, (match, ...args) => {
      const groups = args[args.length - 1] as Record<
        string,
        string | undefined
      >;
      const singleQuotesString =
        groups['singleQuotesStringSBKey'] || groups['singleQuotesString'];
      const doubleQuotesString =
        groups['doubleQuotesStringSBKey'] || groups['doubleQuotesString'];
      const templateString =
        groups['templateStringSBKey'] || groups['templateString'] || '';

      if (singleQuotesString) {
        return toDoubleQuotes(singleQuotesString);
      }

      if (doubleQuotesString) {
        return unescapeSingleQuotes(doubleQuotesString);
      }

      if (templateString) {
        return processTemplateString(templateString);
      }

      if (groups['trailingBracket']) {
        return groups['trailingBracket'];
      }

      if (groups['propertyName']) {
        return `"${groups['propertyName']}"`;
      }

      return match;
    });

  console.log(normalized);

  return JSON.parse(normalized);
}

function unescapeSingleQuotes(string: string) {
  return string.replace(/\\'/g, "'");
}

function unescapeBackQuotes(string: string) {
  return string.replace(/\\`/g, '`');
}

function unescapeDollar(string: string) {
  return string.replace(/\\\$/g, '$');
}

function toDoubleQuotes(string: string) {
  const unquoted = string.substring(1, string.length - 1);
  const escaped = unescapeBackQuotes(unescapeSingleQuotes(unquoted)).replace(
    /(?<!\\)"/g,
    '\\"'
  );

  return `"${escaped}"`;
}

const templateStringHasInterpolationsRegExp = /(?<!\\)\$\{/g;
function processTemplateString(string: string) {
  if (templateStringHasInterpolationsRegExp.test(string)) {
    return string;
  }

  return toDoubleQuotes(unescapeDollar(string.replace(/\n/g, '\\n')));
}
