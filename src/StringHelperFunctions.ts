/** Get the width of a piece of text in real vh units
 * @param text - Text for which to determine the width
 * @param font - Font to use, may be null in which case the default font is used
 * @returns Width of text in pixels
 */

export function getTextWidth(text: string, font?: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw Error('Context cannot be retrieved');

  context.font = font || getComputedStyle(document.body).font;

  return context.measureText(text).width;
}
