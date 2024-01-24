export const hasWhiteSpace = (s) => {
    return /\s/g.test(s);
  }
export const alphaNumericName =(s) => {
  return /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(s);
}