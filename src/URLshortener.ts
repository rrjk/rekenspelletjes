import { plusMinHeleTientallenLink } from './AdditionSubstractionWholeDecadeApp';
import { plusMinBinnenTientalLink } from './AdditionSubstractionWithinDecadeApp';
import { aanklikkenInVolgordeLink } from './ClickInOrderApp';
import { klikFotoOpGetallenlijnLink } from './ClickTheRightPhotoOnNumberLineApp';
import { klokPaartjesLink } from './ClockPairingApp';
import { springOpGetallenlijnLink } from './JumpOnNumberLineApp';
import { sorterenLink } from './SortingGameApp';
import { splitsenLink } from './SplitApp';
import { sommenMetSplitsenLink } from './SumsWithSplitApp';
import { splitsenOpWaardeLink } from './TensSplitApp';
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
  () => sommenMetSplitsenLink('split1Till20', ['plus'], 60),
  () => sommenMetSplitsenLink('split1Till20', ['plus'], 180),
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
  // cm - indexBinnenTiental.html - Sommen tot 10
  () => plusMinBinnenTientalLink([0], ['plus'], 60),
  () => plusMinBinnenTientalLink([0], ['plus'], 180),
  () => plusMinBinnenTientalLink([0], ['minus'], 60),
  () => plusMinBinnenTientalLink([0], ['minus'], 180),
  () => plusMinBinnenTientalLink([0], ['plus', 'minus'], 60),
  () => plusMinBinnenTientalLink([0], ['plus', 'minus'], 180),
  // cs - indexBinnenTiental.html - Sommen van 10 tot 20
  () => plusMinBinnenTientalLink([10], ['plus'], 60),
  () => plusMinBinnenTientalLink([10], ['plus'], 180),
  () => plusMinBinnenTientalLink([10], ['minus'], 60),
  () => plusMinBinnenTientalLink([10], ['minus'], 180),
  () => plusMinBinnenTientalLink([10], ['plus', 'minus'], 60),
  () => plusMinBinnenTientalLink([10], ['plus', 'minus'], 180),
  // cy - indexBinnenTiental.html - Sommen van 10 tot 20
  () =>
    plusMinBinnenTientalLink(
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      ['plus'],
      60
    ),
  () =>
    plusMinBinnenTientalLink(
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      ['plus'],
      180
    ),
  () =>
    plusMinBinnenTientalLink(
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      ['minus'],
      60
    ),
  () =>
    plusMinBinnenTientalLink(
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      ['minus'],
      180
    ),
  () =>
    plusMinBinnenTientalLink(
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      ['plus', 'minus'],
      60
    ),
  () =>
    plusMinBinnenTientalLink(
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      ['plus', 'minus'],
      180
    ),
  // de - indexKlikFotoOpGetallenlijn.html - Getallenlijn van 0 tot 20
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      20,
      [
        'show10TickMarks',
        'show5TickMarks',
        'show1TickMarks',
        'showAll10Numbers',
      ],
      60
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      20,
      [
        'show10TickMarks',
        'show5TickMarks',
        'show1TickMarks',
        'showAll10Numbers',
      ],
      180
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      20,
      ['show10TickMarks', 'show5TickMarks', 'showAll10Numbers'],
      60
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      20,
      ['show10TickMarks', 'show5TickMarks', 'showAll10Numbers'],
      180
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      20,
      ['show10TickMarks', 'showAll10Numbers'],
      60
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      20,
      ['show10TickMarks', 'showAll10Numbers'],
      180
    ),
  () => klikFotoOpGetallenlijnLink(0, 20, ['show10TickMarks'], 60),
  () => klikFotoOpGetallenlijnLink(0, 20, ['show10TickMarks'], 180),
  // dm - indexKlikFotoOpGetallenlijn.html Getallenlijn van 0 tot 100
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      100,
      [
        'show10TickMarks',
        'show5TickMarks',
        'show1TickMarks',
        'showAll10Numbers',
      ],
      60
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      100,
      [
        'show10TickMarks',
        'show5TickMarks',
        'show1TickMarks',
        'showAll10Numbers',
      ],
      180
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      100,
      ['show10TickMarks', 'show5TickMarks', 'showAll10Numbers'],
      60
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      100,
      ['show10TickMarks', 'show5TickMarks', 'showAll10Numbers'],
      180
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      100,
      ['show10TickMarks', 'showAll10Numbers'],
      60
    ),
  () =>
    klikFotoOpGetallenlijnLink(
      0,
      100,
      ['show10TickMarks', 'showAll10Numbers'],
      180
    ),
  () => klikFotoOpGetallenlijnLink(0, 100, ['show10TickMarks'], 60),
  () => klikFotoOpGetallenlijnLink(0, 100, ['show10TickMarks'], 180),
  // du - indexSpringOpGetallenlijn.html - Getallenlijn van 0 tot 20
  () =>
    springOpGetallenlijnLink(
      0,
      20,
      [
        'show10TickMarks',
        'show5TickMarks',
        'show1TickMarks',
        'showAll10Numbers',
      ],
      60
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      20,
      [
        'show10TickMarks',
        'show5TickMarks',
        'show1TickMarks',
        'showAll10Numbers',
      ],
      180
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      20,
      ['show10TickMarks', 'show5TickMarks', 'showAll10Numbers'],
      60
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      20,
      ['show10TickMarks', 'show5TickMarks', 'showAll10Numbers'],
      180
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      20,
      ['show10TickMarks', 'showAll10Numbers'],
      60
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      20,
      ['show10TickMarks', 'showAll10Numbers'],
      180
    ),
  () => springOpGetallenlijnLink(0, 20, ['show10TickMarks'], 60),
  () => springOpGetallenlijnLink(0, 20, ['show10TickMarks'], 180),
  // ec
  () =>
    springOpGetallenlijnLink(
      0,
      100,
      [
        'show10TickMarks',
        'show5TickMarks',
        'show1TickMarks',
        'showAll10Numbers',
      ],
      60
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      100,
      [
        'show10TickMarks',
        'show5TickMarks',
        'show1TickMarks',
        'showAll10Numbers',
      ],
      180
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      100,
      ['show10TickMarks', 'show5TickMarks', 'showAll10Numbers'],
      60
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      100,
      ['show10TickMarks', 'show5TickMarks', 'showAll10Numbers'],
      180
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      100,
      ['show10TickMarks', 'showAll10Numbers'],
      60
    ),
  () =>
    springOpGetallenlijnLink(
      0,
      100,
      ['show10TickMarks', 'showAll10Numbers'],
      180
    ),
  () => springOpGetallenlijnLink(0, 100, ['show10TickMarks'], 60),
  () => springOpGetallenlijnLink(0, 100, ['show10TickMarks'], 180),
  // ek -- indexKlokPaartjesAnaloogZin.html
  () => klokPaartjesLink(['Hour'], ['Analog', 'Sentence'], 60),
  () => klokPaartjesLink(['Hour'], ['Analog', 'Sentence'], 180),
  () => klokPaartjesLink(['HalfHour', 'Hour'], ['Analog', 'Sentence'], 60),
  () => klokPaartjesLink(['HalfHour', 'Hour'], ['Analog', 'Sentence'], 180),
  () =>
    klokPaartjesLink(
      ['QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Sentence'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Sentence'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Sentence'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Sentence'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['Minute', '10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Sentence'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['Minute', '10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Sentence'],
      180
    ),
  // eu -- indexKlokPaartjesDigitaalZin.html
  () => klokPaartjesLink(['Hour'], ['Sentence', 'Digital'], 60),
  () => klokPaartjesLink(['Hour'], ['Sentence', 'Digital'], 180),
  () => klokPaartjesLink(['HalfHour', 'Hour'], ['Sentence', 'Digital'], 60),
  () => klokPaartjesLink(['HalfHour', 'Hour'], ['Sentence', 'Digital'], 180),
  () =>
    klokPaartjesLink(
      ['QuarterHour', 'HalfHour', 'Hour'],
      ['Sentence', 'Digital'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['QuarterHour', 'HalfHour', 'Hour'],
      ['Sentence', 'Digital'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Sentence', 'Digital'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Sentence', 'Digital'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['Minute', '10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Sentence', 'Digital'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['Minute', '10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Sentence', 'Digital'],
      180
    ),
  // fe -- indexKlokPaartjesAnaloogDigitaal.html
  () => klokPaartjesLink(['Hour'], ['Analog', 'Digital'], 60),
  () => klokPaartjesLink(['Hour'], ['Analog', 'Digital'], 180),
  () => klokPaartjesLink(['HalfHour', 'Hour'], ['Analog', 'Digital'], 60),
  () => klokPaartjesLink(['HalfHour', 'Hour'], ['Analog', 'Digital'], 180),
  () =>
    klokPaartjesLink(
      ['QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['Minute', '10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['Minute', '10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital'],
      180
    ),
  // fo -- indexKlokPaartjesAnaloogDigitaalZin.html
  () => klokPaartjesLink(['Hour'], ['Analog', 'Digital', 'Sentence'], 60),
  () => klokPaartjesLink(['Hour'], ['Analog', 'Digital', 'Sentence'], 180),
  () =>
    klokPaartjesLink(
      ['HalfHour', 'Hour'],
      ['Analog', 'Digital', 'Sentence'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['HalfHour', 'Hour'],
      ['Analog', 'Digital', 'Sentence'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital', 'Sentence'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital', 'Sentence'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital', 'Sentence'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital', 'Sentence'],
      180
    ),
  () =>
    klokPaartjesLink(
      ['Minute', '10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital', 'Sentence'],
      60
    ),
  () =>
    klokPaartjesLink(
      ['Minute', '10Minute', 'QuarterHour', 'HalfHour', 'Hour'],
      ['Analog', 'Digital', 'Sentence'],
      180
    ),
  // fy - indexSplitsenOpwaarde.html
  () => splitsenOpWaardeLink(60),
  () => splitsenOpWaardeLink(180),
  // ga - indexSommenTot20Splitsen.html (3rd - 6th item, 1st and 2nd are a and b)
  () => sommenMetSplitsenLink('split1Till20', ['minus'], 60),
  () => sommenMetSplitsenLink('split1Till20', ['minus'], 180),
  () => sommenMetSplitsenLink('split1Till20', ['plus', 'minus'], 60),
  () => sommenMetSplitsenLink('split1Till20', ['plus', 'minus'], 180),
  // ge - indexSterSpel.html - Plus en min sommen met hele tientallen erbij of eraf
  () => plusMinHeleTientallenLink('decadeLast', ['plus'], 60),
  () => plusMinHeleTientallenLink('decadeLast', ['plus'], 180),
  () => plusMinHeleTientallenLink('decadeLast', ['minus'], 60),
  () => plusMinHeleTientallenLink('decadeLast', ['minus'], 180),
  () => plusMinHeleTientallenLink('decadeLast', ['plus', 'minus'], 60),
  () => plusMinHeleTientallenLink('decadeLast', ['plus', 'minus'], 180),
  // gk indexSterSpel.html - Plus en min sommen vanuit een heel tiental
  () => plusMinHeleTientallenLink('decadeFirst', ['plus'], 60),
  () => plusMinHeleTientallenLink('decadeFirst', ['plus'], 180),
  () => plusMinHeleTientallenLink('decadeFirst', ['minus'], 60),
  () => plusMinHeleTientallenLink('decadeFirst', ['minus'], 180),
  () => plusMinHeleTientallenLink('decadeFirst', ['plus', 'minus'], 60),
  () => plusMinHeleTientallenLink('decadeFirst', ['plus', 'minus'], 180),
  // gq
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
