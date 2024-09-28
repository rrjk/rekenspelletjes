import { aanklikkenInVolgordeLink } from './ClickInOrderApp';
import { sorterenLink } from './SortingGameApp';
import { splitsenLink } from './SplitApp';
import { sommenMetSplitsenLink } from './SumsWithSplitApp';
import { welkeHandHeeftMeerStippenLink } from './WhichIsBiggerApp';

/** Function to determine the number belonging to a string of lower case letters
 * a equals 0, b equals 1 etc
 * If we count the positions of the letters from right to left, starting with zero
 * The value of a letter is <letter-value>*(26**index)
 * Returns null in case one of the characters in a is not a lowecase letter.
 */
function stringValue(a: string): number | null {
  let value = 0;
  const len = a.length;

  for (let position = 0; position < len; position++) {
    const letterValue = a.charCodeAt(len - 1 - position) - 97;
    if (letterValue < 0 || letterValue > 25) return null;
    value += (a.charCodeAt(len - 1 - position) - 97) * 26 ** position;
  }

  return value;
}

// We use an array with function pointers to prevent that all urls are created, where we only need one
const urls: (() => string)[] = [
  // a - indexSommenTot20Splitsen first two items
  () => sommenMetSplitsenLink('split1Till20', true, false, 60),
  () => sommenMetSplitsenLink('split1Till20', true, false, 180),
  // c - indexWelkeHandHeeftMeerStippen
  () => welkeHandHeeftMeerStippenLink(true, false, 60),
  () => welkeHandHeeftMeerStippenLink(true, false, 180),
  () => welkeHandHeeftMeerStippenLink(false, false, 180),
  () => welkeHandHeeftMeerStippenLink(false, false, 180),
  () => welkeHandHeeftMeerStippenLink(false, true, 180),
  () => welkeHandHeeftMeerStippenLink(false, true, 180),
  // i - indexSorteren.html 1
  () => sorterenLink(2, 1, 10, 1, 'red', 60),
  () => sorterenLink(2, 1, 10, 1, 'red', 180),
  () => sorterenLink(3, 1, 10, 1, 'red', 60),
  () => sorterenLink(3, 1, 10, 1, 'red', 180),
  () => sorterenLink(4, 1, 10, 1, 'red', 60),
  () => sorterenLink(4, 1, 10, 1, 'red', 180),
  // o - indexSorteren.html 2
  () => sorterenLink(2, 1, 30, 1, 'red', 60),
  () => sorterenLink(2, 1, 30, 1, 'red', 180),
  () => sorterenLink(3, 1, 30, 1, 'red', 60),
  () => sorterenLink(3, 1, 30, 1, 'red', 180),
  () => sorterenLink(4, 1, 30, 1, 'red', 60),
  () => sorterenLink(4, 1, 30, 1, 'red', 180),
  // u - indexSorteren.html 3
  () => sorterenLink(2, 1, 50, 1, 'red', 60),
  () => sorterenLink(2, 1, 50, 1, 'red', 180),
  () => sorterenLink(3, 1, 50, 1, 'red', 60),
  () => sorterenLink(3, 1, 50, 1, 'red', 180),
  () => sorterenLink(4, 1, 50, 1, 'red', 60),
  () => sorterenLink(4, 1, 50, 1, 'red', 180),
  // ba - indexSorteren.html 4
  () => sorterenLink(2, 1, 100, 1, 'red', 60),
  () => sorterenLink(2, 1, 100, 1, 'red', 180),
  () => sorterenLink(3, 1, 100, 1, 'red', 60),
  () => sorterenLink(3, 1, 100, 1, 'red', 180),
  () => sorterenLink(4, 1, 100, 1, 'red', 60),
  () => sorterenLink(4, 1, 100, 1, 'red', 180),
  // bg - indexAanklikkenInVolgorde.html
  () => aanklikkenInVolgordeLink(1, 10, 'ascending', [], 'hideSum', 'all'),
  () => aanklikkenInVolgordeLink(11, 10, 'ascending', [], 'hideSum', 'all'),
  () => aanklikkenInVolgordeLink(1, 20, 'ascending', [], 'hideSum', 'all'),
  () => aanklikkenInVolgordeLink(11, 20, 'ascending', [], 'hideSum', 'all'),
  () => aanklikkenInVolgordeLink(21, 20, 'ascending', [], 'hideSum', 'all'),
  () => aanklikkenInVolgordeLink(31, 20, 'ascending', [], 'hideSum', 'all'),
  () => aanklikkenInVolgordeLink(1, 50, 'ascending', [], 'hideSum', 'all'),
  () => aanklikkenInVolgordeLink(20, 20, 'descending', [], 'hideSum', 'all'),
  () =>
    aanklikkenInVolgordeLink('random', 20, 'ascending', [], 'hideSum', 'all'),
  () => aanklikkenInVolgordeLink(2, 10, 'ascending', [], 'hideSum', 'even'),
  () => aanklikkenInVolgordeLink(1, 10, 'ascending', [], 'hideSum', 'odd'),
  // br - indexSplitsen.html 1
  () => splitsenLink([4], 60),
  () => splitsenLink([4], 180),
  () => splitsenLink([5], 60),
  () => splitsenLink([5], 180),
  () => splitsenLink([6], 60),
  () => splitsenLink([6], 180),
  () => splitsenLink([7], 60),
  () => splitsenLink([7], 180),
  () => splitsenLink([8], 60),
  () => splitsenLink([8], 180),
  () => splitsenLink([9], 60),
  () => splitsenLink([9], 180),
  () => splitsenLink([10], 60),
  () => splitsenLink([10], 180),
  // cf - indexSplitsen.html 2
  () => splitsenLink([1, 2, 3, 4, 5, 10], 60),
  () => splitsenLink([1, 2, 3, 4, 5, 10], 180),
  () => splitsenLink([6, 7, 8, 9, 10], 60),
  () => splitsenLink([6, 7, 8, 9, 10], 180),
  () => splitsenLink([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 60),
  () => splitsenLink([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 180),
  // cl - indexVerliefdeharten.html
  () => `../Rekenspelletjes/SomPaartjes.html`,
  // cm - indexVerliefdeharten.html
];

const urlParams = new URLSearchParams(window.location.search);

const key = urlParams.keys().next().value;

const root = `../Rekenspelletjes/index.html`;

let newUrl = root; // By default we link to the root menu.

if (key) {
  const index = stringValue(key);
  if (index !== null) {
    if (urls[index]) {
      newUrl = urls[index](); // If a proper shortcode is found, we link there.
    }
  }
}
window.location.href = newUrl;
