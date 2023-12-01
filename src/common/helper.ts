export const hasWhiteSpace = (s) => {
    return /\s/g.test(s);
  }
export const alphaNumericName =(s) => {
  return /^[a-zA-Z0-9-.]*$/.test(s);
}