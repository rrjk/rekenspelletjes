/** Create an  array with a sequence of integers
 *
 * @param start - first number in the array
 * @param step - step to take for each entry
 * @param length  - number of elements for generated array
 */
export function rangeWithLength(start: number, step: number, length: number) {
  return Array.from({ length }, (_, i) => start + i * step);
}

/** Create an array with a sequence of integers, starting at start and ending on a before stop
 *
 * @param start - first number in the array
 * @param stop - number to stop the sequence, this number is the last number that may be included
 * @param stop - step to take for each entry, default is 1
 */
export function rangeFromTo(start: number, stop: number, step = 1) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
}
