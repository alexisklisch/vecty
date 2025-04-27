export const tagRegex = (tag: string) => {
  return new RegExp(
    `<${tag}\\b(?:(?:"[^"]*"|'[^']*'|\\{[^}]*\\}|[^>])*)(?:\\/>|>(?:(?!<\\/${tag}>).*?)<\\/${tag}>)`,
    'gs'
  )
}