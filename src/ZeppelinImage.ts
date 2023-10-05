export function getZeppelinAsSvgString(
  wingColor: string,
  fillColor1: string,
  fillColor2: string
): string {
  return (
    `<svg version="1.1" viewBox="0 0 453.48 453.48" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
    `<path style="fill:${wingColor};" d="M369.14,309.23v12.68c0,12.46-10.1,22.55-22.55,22.55H224.35v-24.8c3.98,0.12,7.96,0.18,11.93,0.18C283.77,319.84,330.95,318.34,369.14,309.23z"/>` +
    `<polygon style="fill:${wingColor};" points="28.81,257.53 30.23,253.81 122.52,253.81 114.03,266.67 94.86,295.72 70.01,333.37 0,333.37"/>` +
    `<polygon style="fill:${wingColor};" points="28.81,184.86 0,109.02 70.01,109.02 94.85,146.66 114.02,175.71 114.03,175.71 122.52,188.58 30.23,188.58"/>` +
    `<path style="fill:${fillColor1};" d="M236.28,122.54c109.41,0,217.18,17.5,217.2,98.64c-0.02-45.6-107.79-55.43-217.2-55.43c-42.13,0-85.2,3.68-122.25,9.96h-0.01l-19.17-29.05C135.71,131.63,186.65,122.54,236.28,122.54z"/>` +
    `<path style="fill:${fillColor1};" d="M11.13,221.2h442.35c-0.01,50.96-107.79,55.43-217.2,55.43c-42.13,0-85.21-3.68-122.25-9.96l8.49-12.86H30.23l-1.42,3.72C17.56,246.29,11.13,234.03,11.13,221.2z"/>` +
    `<path style="fill:${fillColor2};" d="M369.14,309.23c-38.19,9.11-85.37,10.61-132.86,10.61c-3.97,0-7.95-0.06-11.93-0.18c-45.78-1.31-91.91-10.11-129.48-23.94h-0.01l19.17-29.05c37.04,6.28,80.12,9.96,122.25,9.96c109.41,0,217.19-4.47,217.2-55.43C453.48,272.53,418.95,297.35,369.14,309.23z"/>` +
    `<path style="fill:${fillColor2};" d="M453.48,221.19v0.01H11.13c0-12.84,6.43-25.09,17.68-36.34l1.42,3.72h92.29l-8.49-12.87c37.05-6.28,80.12-9.96,122.25-9.96c109.41,0,217.18,9.83,217.2,55.43V221.19z"/>` +
    `</svg>`
  );
}

export function getZeppelinAsSvgUrl(
  wingColor: string,
  fillColor1: string,
  fillColor2: string
): string {
  return encodeURIComponent(
    getZeppelinAsSvgString(wingColor, fillColor1, fillColor2)
  );
}
