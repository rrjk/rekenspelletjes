export function getHexagonAsSvgString(
  borderColor: string,
  fillColor: string,
): string {
  return (
    `<svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">` +
    `<g id="color">` +
    `<path fill="${fillColor}" d="M35.024 8.2613C35.6281 7.9129 36.3718 7.9129 36.9759 8.2613L59.5344 21.286C60.1385 21.6344 60.5103 22.2785 60.5103 22.9763V49.0237C60.5103 49.7215 60.1385 50.3656 59.5344 50.714L36.9759 63.7387C36.3718 64.0871 35.6281 64.0871 35.024 63.7387L12.4655 50.714C11.8615 50.3656 11.4896 49.7215 11.4896 49.0237V22.9763C11.4896 22.2785 11.8615 21.6344 12.4655 21.286L35.024 8.2613Z"/>` +
    `</g>` +
    `<g id="line">` +
    `<path fill="none" stroke="${borderColor}" stroke-width="2" d="M35.024 8.2613C35.6281 7.9129 36.3718 7.9129 36.9759 8.2613L59.5344 21.286C60.1385 21.6344 60.5103 22.2785 60.5103 22.9763V49.0237C60.5103 49.7215 60.1385 50.3656 59.5344 50.714L36.9759 63.7387C36.3718 64.0871 35.6281 64.0871 35.024 63.7387L12.4655 50.714C11.8615 50.3656 11.4896 49.7215 11.4896 49.0237V22.9763C11.4896 22.2785 11.8615 21.6344 12.4655 21.286L35.024 8.2613Z"/>` +
    `</g>` +
    `</svg>`
  );
}

export function getHexagonAsSvgUrl(
  borderColor: string,
  fillColor: string,
): string {
  return encodeURIComponent(getHexagonAsSvgString(borderColor, fillColor));
}
