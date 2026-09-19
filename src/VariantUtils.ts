export function previousVariant(variant: string) {
  if (variant.length === 1) {
    if (variant === 'a') return 'a';
    if (variant >= 'b' && variant <= 'z')
      return String.fromCharCode(variant.charCodeAt(0) - 1);
    else return variant;
  }
  if (variant.length === 2) {
    if (variant === 'aa') return 'aa';
    if (
      variant[0] >= 'a' &&
      variant[0] >= 'a' &&
      variant[0] <= 'z' &&
      variant[1] <= 'z'
    ) {
      const res = variant.split('');
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === 'a') {
          res[i] = 'z'; // wrap and borrow from the next letter to the left
        } else {
          res[i] = String.fromCharCode(res[i].charCodeAt(0) - 1);
          return res.join('');
        }
      }
    }
  }
  return variant;
}

export function nextVariant(variant: string) {
  if (variant.length === 1) {
    if (variant === 'z') return 'z';
    if (variant >= 'a' && variant <= 'y')
      return String.fromCharCode(variant.charCodeAt(0) + 1);
    else return variant;
  }
  if (variant.length === 2) {
    if (variant === 'zz') return 'zz';
    if (
      variant[0] >= 'a' &&
      variant[0] >= 'a' &&
      variant[0] <= 'z' &&
      variant[1] <= 'z'
    ) {
      const res = variant.split('');
      for (let i = res.length - 1; i >= 0; i--) {
        if (res[i] === 'z') {
          res[i] = 'a'; // wrap and add to the next letter to the left
        } else {
          res[i] = String.fromCharCode(res[i].charCodeAt(0) + 1);
          return res.join('');
        }
      }
    }
  }
  return variant;
}
