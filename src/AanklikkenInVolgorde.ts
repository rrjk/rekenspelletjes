/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import { html } from 'lit';

import './BallenVeldInvoer';
import './GameOverDialog';
import './MessageDialog';
import './TimedScoreBox';
import type { BallFieldEntry } from './BallenVeldInvoer';
import type { GameOverDialog } from './GameOverDialog';
import type { MessageDialog } from './MessageDialog';
import type { TimedScoreBox } from './TimedScoreBox';

import { randomIntFromRange } from './Randomizer';

/* Custom element to create a field of balls that can be clicked
    --ballFieldWidth the width of the ballField
    --ballFieldHeight the height of the ballField.
*/

class AanklikkenInVolgordeApp {
  labelsInOrder: string[];
  scoreBox: TimedScoreBox;
  ballFieldEntry: BallFieldEntry;
  gameOverDialog: GameOverDialog;
  messageDialog: MessageDialog;
  ballToFindIndex: number;
  startGameText: string;

  constructor() {
    this.updateViewPortHeight();
    // We listen to the resize event to ensure that upon a resize of the browser window, or an orientation change on mobile, --vh is properly updated.
    window.addEventListener('resize', () => {
      this.updateViewPortHeight();
    });

    this.labelsInOrder = [];
    this.startGameText = ``;
    this.scoreBox = <TimedScoreBox>document.getElementById('scoreBox');

    this.ballFieldEntry = <BallFieldEntry>(
      document.getElementById('ballFieldEntry')
    );
    this.gameOverDialog = <GameOverDialog>(
      document.getElementById('gameOverDialog')
    );
    this.messageDialog = <MessageDialog>(
      document.getElementById('messageDialog')
    );

    this.ballFieldEntry.setPreventCollisionElements([this.scoreBox]);
    this.ballFieldEntry.addEventListener('input-clicked', (evt: Event) =>
      this.inputClicked(<CustomEvent>evt),
    );

    this.parsePossibleNumbersFromUrl();
    this.ballFieldEntry.setBallLabels(this.labelsInOrder.slice(0)); // .slice(0) added to pass a (shallow) copy of the list, in stead of the list itself, to prevent alteratin propagating back and forth.
    this.ballToFindIndex = 0;

    this.initiateGame();
  }

  async initiateGame(): Promise<void> {
    await this.scoreBox.updateComplete;
    await this.ballFieldEntry.updateComplete;
    await this.gameOverDialog.updateComplete;
    await this.messageDialog.updateComplete;

    this.scoreBox.pause();
    this.messageDialog
      .show('Ballen knallen', html`this.startGameText`)
      .then(() => {
        this.scoreBox.resetScore();
      });
  }

  inputClicked(evt: CustomEvent) {
    if (evt.detail.label === this.labelsInOrder[this.ballToFindIndex]) {
      this.ballFieldEntry.removeBall(evt.detail.cell);
      this.ballFieldEntry.enableAllPresentBalls();
      this.ballToFindIndex += 1;
      if (this.ballToFindIndex === this.labelsInOrder.length) {
        this.gameOver();
      }
    } else {
      this.scoreBox.increaseNok();
      this.ballFieldEntry.disableBall(evt.detail.cell);
    }
  }

  gameOver() {
    this.scoreBox.pause();
    this.gameOverDialog
      .show(
        html` <p>
            Je hebt alle ballen weggeklikt in ${this.scoreBox.getTimeAsString()}
            minuten!
          </p>
          <p>
            Je hebt
            ${this.scoreBox.numberNok === 0 ? 'geen' : this.scoreBox.numberNok}
            ${this.scoreBox.numberNok === 1 ? 'fout' : 'fouten'} gemaakt.
          </p>`,
      )
      .then(result => {
        if (result === 'again') this.resetGame();
        else window.location.href = 'index.html';
      });
  }

  resetGame() {
    this.ballFieldEntry.shuffleBalls();
    this.ballToFindIndex = 0;
    this.scoreBox.resetScore();
  }

  parsePossibleNumbersFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    this.labelsInOrder = [];
    if (urlParams.has('tableOfMultiplication')) {
      const tableAsInt = parseInt(
        urlParams.get('tableOfMultiplication') || '',
        10,
      );
      if (!Number.isNaN(tableAsInt)) {
        for (let i = 1; i <= 10; i++) {
          this.labelsInOrder.push(`${i * tableAsInt}`);
        }
        this.startGameText = `Klik de getallen aan, van klein naar groot,
        met sprongen van ${tableAsInt}.`;
      }
    } else if (urlParams.has('random')) {
      const random = parseInt(urlParams.get('random') || '', 10);
      let startNumber = randomIntFromRange(20, 80);
      if (!Number.isNaN(random)) {
        startNumber = random;
      }
      for (let i = startNumber; i < startNumber + 20; i++) {
        this.labelsInOrder.push(`${i}`);
      }
      this.startGameText = `Klik de getallen aan, van klein naar groot,
      begin bij ${startNumber}.`;
    } else {
      const numbersToSplitFromUrl = urlParams.getAll('number');
      for (let i = 0; i < numbersToSplitFromUrl.length; i++) {
        const numberAsInt = parseInt(numbersToSplitFromUrl[i], 10);
        if (!Number.isNaN(numberAsInt)) {
          this.labelsInOrder.push(`${numberAsInt}`);
        }
      }
      this.startGameText = `Klik de getallen aan van klein naar groot.`;
    }
    if (this.labelsInOrder.length === 0) {
      this.labelsInOrder = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      this.startGameText = `Klik de getallen aan van klein naar groot.`;
    }
    if (urlParams.has('introText')) {
      this.startGameText = `${urlParams.get('introText')}`;
    }
  }

  updateViewPortHeight() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
/*
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
const vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event to ensure that upon a resize of the browser window, or an orientation change on mobile, --vh is properly updated.
window.addEventListener('resize', () => {
    // We execute the same script as before
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
*/

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const app = new AanklikkenInVolgordeApp();
});
