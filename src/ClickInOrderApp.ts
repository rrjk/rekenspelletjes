import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeCountingGame } from './TimeCountingGame';
import './BallFieldEntry';

import { randomIntFromRange } from './Randomizer';
import { GameLogger } from './GameLogger';
import { BallFieldEntry } from './BallenVeldInvoer';

@customElement('click-in-order-app')
export class ClickInOrderApp extends TimeCountingGame {
  @state()
  labelsInOrder: string[] = [];
  @state()
  disabledBallLabels: string[] = [];
  @state()
  invisibleBallLabels: string[] = [];
  welcomeMessageString = '';

  @state()
  gameElementsDisabled = true;

  private nextBallToClick = 0;
  private gameLogger = new GameLogger('H', '');

  constructor() {
    super();
    this.parseUrl();
  }

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>${this.welcomeMessageString}</p>`;
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.labelsInOrder = [];

    let nmbrBallsAsInt = parseInt(urlParams.get('nmbrBalls') || '', 10);
    if (Number.isNaN(nmbrBallsAsInt)) nmbrBallsAsInt = 10;

    if (urlParams.has('start')) {
      let startAsInt = parseInt(urlParams.get('start') || '', 10);
      if (Number.isNaN(startAsInt)) startAsInt = 1;
      if (urlParams.has('descending')) {
        for (let i = startAsInt; i > startAsInt - nmbrBallsAsInt; i--) {
          this.labelsInOrder.push(`${i}`);
          this.welcomeMessageString = `Klik de getallen aan, van groot naar klein, begin bij ${startAsInt}.`;
        }
        this.gameLogger.setSubCode('b');
      } else {
        for (let i = startAsInt; i < startAsInt + nmbrBallsAsInt; i++) {
          this.labelsInOrder.push(`${i}`);
          this.welcomeMessageString = `Klik de getallen aan, van klein naar groot, begin bij ${startAsInt}.`;
        }
        this.gameLogger.setSubCode('b');
      }
    } else if (urlParams.has('tableOfMultiplication')) {
      let tableAsInt = parseInt(
        urlParams.get('tableOfMultiplication') || '',
        10
      );
      if (Number.isNaN(tableAsInt)) tableAsInt = 10;
      for (let i = 1; i <= nmbrBallsAsInt; i++) {
        this.labelsInOrder.push(`${i * tableAsInt}`);
      }
      this.welcomeMessageString = `Klik de getallen aan, van klein naar groot,
        met sprongen van ${tableAsInt}.`;
      this.gameLogger.setSubCode('d');
    } else if (urlParams.has('random')) {
      const startNumber = randomIntFromRange(20, 80);

      for (let i = startNumber; i < startNumber + nmbrBallsAsInt; i++) {
        this.labelsInOrder.push(`${i}`);
      }
      this.welcomeMessageString = `Klik de getallen aan, van klein naar groot,
      begin bij ${startNumber}.`;
      this.gameLogger.setSubCode('c');
    }
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        #ballFieldEntry {
          height: 100%;
          width: 100%;
        }
      `,
    ];
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    return result;
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.nextBallToClick = 0;
    this.gameElementsDisabled = false;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return 'Klik aan in de juiste volgorde';
  }

  handleBallClick(label: string) {
    if (label === this.labelsInOrder[this.nextBallToClick]) {
      this.handleCorrectAnswer(label);
    } else {
      this.handleWrongAnswer(label);
    }
  }

  get ballFieldEntry(): BallFieldEntry {
    return this.getElement<BallFieldEntry>('ball-field-entry');
  }

  private handleCorrectAnswer(label: string): void {
    this.numberOk += 1;
    this.invisibleBallLabels = this.invisibleBallLabels.concat(label); // We don't use push as that doesn't trigger an update of the ball-field-entry
    this.disabledBallLabels = [];
    this.nextBallToClick += 1;
    if (this.nextBallToClick === this.labelsInOrder.length)
      this.handleGameOver();
  }

  private handleWrongAnswer(label: string): void {
    this.numberNok += 1;
    this.disabledBallLabels = this.disabledBallLabels.concat(label); // // We don't use push as that doesn't trigger an update of the ball-field-entry
  }

  executeGameOverActions(): void {
    super.executeGameOverActions();
    this.gameElementsDisabled = true;
    this.disabledBallLabels = [];
    this.invisibleBallLabels = [];
    this.labelsInOrder = [...this.labelsInOrder]; // We create a new array with labels in order, such that a shuffle is triggerd in ball-field entry
    this.gameLogger.logGameOver();
  }

  renderGameContent(): HTMLTemplateResult {
    return html`
      <ball-field-entry
          id="ballFieldEntry"
          ?disabled=${this.gameElementsDisabled}
          .ballLabels=${this.labelsInOrder}
          .disabledBallLabels=${this.disabledBallLabels}
          .invisibleBallLabels=${this.invisibleBallLabels}
          @ball-clicked=${(evt: CustomEvent) =>
            this.handleBallClick(evt.detail.label)}
        ></ball-field-entry>
      </button>
    `;
  }
}
