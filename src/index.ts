const singleLineCommentsRegExp = /\/\/.*/gm;
const multiLineCommentsRegExp = /\/\*(.|\n)*?\*\//gm;
const trailingCommasRegExp = /(,)((?:\s|\n)*?(?:}|]))/gm;
const unquotedPropertyRegExp = /(?<name>[a-zA-Z0-9]+)(\n|\s)*:/gm;
const stringsRegExp = /(?<!\\)(?<quote>['"])(?:\\\k<quote>|.)*?\k<quote>/gm;

function unescapeDoubleQuotesString(string: string) {
  return string.replace(/\\'/gm, "'");
}

function singleQuotesToDoubleQuotes(string: string) {
  const unquoted = string.substring(1, string.length - 1);
  const escaped = unescapeDoubleQuotesString(unquoted).replace(
    /(?<!\\)"/gm,
    '\\"'
  );

  return `"${escaped}"`;
}

function normalizeJSStrings(string: string) {
  return string.replace(stringsRegExp, match => {
    return match[0] === "'"
      ? singleQuotesToDoubleQuotes(match)
      : unescapeDoubleQuotesString(match);
  });
}

function removeJSComments(string: string) {
  return string
    .replace(multiLineCommentsRegExp, '')
    .replace(singleLineCommentsRegExp, '');
}

function removeTrailingCommas(string: string) {
  return string.replace(trailingCommasRegExp, '$2');
}

export function jsObjectAsStringToJSON(jsObjectAsString: string): string {
  const normalized = normalizeJSStrings(
    removeTrailingCommas(removeJSComments(jsObjectAsString))
  ).replace(unquotedPropertyRegExp, '"$1":');

  // validate
  JSON.parse(normalized);

  return normalized;
}
