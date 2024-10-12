export function getRocketAsSvgString(
  lineColor: string,
  wingColor: string,
): string {
  return (
    `<svg version="1.1" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
    `<path d="M 64 3 C 31 33 37 63 43 76 C 51 89 46 81 54 93 H 64 V 85 M 64 93 H 74 C 82 81 77 89 85 76 C 91 63 97 33 64 3" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" fill="white"/>` +
    `<path d="M 54 93 L 36 102 C 26 92 32.5 89 43 76 C 51 89 46 81 54 93" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" fill="${wingColor}"/>` +
    `<path d="M 74 93 L 92 102 C 102 92 95.5 89 85 76 C 77 89 82 81 74 93" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" fill="${wingColor}"/>` +
    `<path d="M 69 100 L 59 100 C 50 106 51 113 64 125 C 78 113 77 106 69 100" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" fill="lightgrey"/>` +
    `<circle cx="64" cy="31.6" fill="lightgrey" r="6.7" stroke="${lineColor}" stroke-width="2"/></svg>`
  );
}

export function getRocketAsSvgUrl(
  lineColor: string,
  wingColor: string,
): string {
  return encodeURIComponent(getRocketAsSvgString(lineColor, wingColor));
}
