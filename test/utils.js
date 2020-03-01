exports.line = (s) =>
  s.trim()
    .replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')')
