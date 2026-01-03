export function joinWithEn<T extends number | string>(arr: T[]): string {
  if (arr.length === 0) return '';
  if (arr.length === 1) return `${arr[0]}`;
  if (arr.length === 2) return arr.join(' en ');

  return `${arr.slice(0, -1).join(', ')} en ${arr[arr.length - 1]}`;
}
