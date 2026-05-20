export const defaultTime = 60;

export const timeCodes = ['a', 'b', 'c'] as const;
export type TimeCode = (typeof timeCodes)[number];
export const timeCodeMapping: Record<TimeCode, number> = {
  a: defaultTime,
  b: 180,
  c: 300,
};

export function isTimeCode(code: string): code is TimeCode {
  return timeCodes.includes(code as TimeCode);
}

export const hourGlassIcons: Record<TimeCode, URL> = {
  a: new URL('../images/hourglass_1min.png', import.meta.url),
  b: new URL('../images/hourglass_3min.png', import.meta.url),
  c: new URL('../images/hourglass_5min.png', import.meta.url),
};

/** Function to convert a string into a time code.
  If the string is not a time code, the conversion defaults to a
*/
export function stringToTimeCode(attributeValue: string | null): TimeCode {
  if (attributeValue && isTimeCode(attributeValue)) return attributeValue;
  else return 'a';
}

/** Convert attribute to time code when present; absent or invalid means no time. */
export function optionalStringToTimeCode(
  attributeValue: string | null,
): TimeCode | undefined {
  if (attributeValue === null) return undefined;
  return isTimeCode(attributeValue) ? attributeValue : undefined;
}

/** Convert time code to attribute value; undefined omits the attribute. */
export function timeCodeToAttribute(
  value: TimeCode | undefined,
): string | null {
  return value === undefined ? null : value;
}
