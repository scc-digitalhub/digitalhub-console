export const hasWhiteSpace = (s) => {
    return /\s/g.test(s);
  }
export const alphaNumericName =(s) => {
  return /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(s);
}

export const arePropsEqual = (oldProps: any, newProps: any) => {
  if (!newProps.record) return true;
  return Object.is(oldProps.record, newProps.record);
};