import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
// eslint-disable-next-line import/extensions
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeCountingGame } from './TimeCountingGame';
import './MompitzNumber';
import './DynamicGrid';
import './DraggableElement';

import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
  shuffleArray,
} from './Randomizer';

import { GameLogger } from './GameLogger';

import './RealHeight';
import { getHeartasHTMLTemplateResult } from './HeartImage';

@customElement('combine-to-solve-sum-app')
export class CombineToSolveSumApp extends TimeCountingGame {
  private gameLogger = new GameLogger('N', '');

  private initialNumberOfPairs = 13;
  private maxNumberOfPairs = 20;
  private sum = 10;

  constructor() {
    super();
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    // Get sum from the url. If no sum is present in the url, use 10.
    this.sum = parseInt(urlParams.get('sum') || '10', 10);
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>
      Sleep twee harten over elkaar heen die samen ${this.sum} maken
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Verliefde harten`;
  }

  private handleCorrectAnswer(): void {
    this.numberOk += 1;
  }

  private handleWrongAnswer(): void {
    this.numberNok += 1;
  }

  private newRound() {
    // To be filled in
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  async firstUpdated(): Promise<void> {
    await this.getUpdateComplete();

    /* Workaround for bug found in firefox where draggable=false is ignored in case user-select is set to none.
     * Please note that this expression cannot pierce into webcomponent's shadowroms.
     * The img in slots are found though.
     */
    if (window.navigator.userAgent.toLowerCase().includes('firefox')) {
      this.renderRoot.querySelectorAll('img[draggable=false]').forEach(el => {
        el.addEventListener('mousedown', event => event.preventDefault());
      });
    }
    return super.firstUpdated();
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        button {
          border: 0px;
          background-color: transparent;
        }
        button.selected {
          background-color: lightblue;
        }
      `,
    ];
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const cells: HTMLTemplateResult[] = [];
    for (let i = 0; i < 12; i++)
      cells.push(
        html`<draggable-element
          >${getHeartasHTMLTemplateResult('teal', `${i}`)}</draggable-element
        >`
      );

    return html`
      <dynamic-grid
        contentAspectRatio="1"
        padding="0"
        style="width: 100%; height: 100%; top: 0;"
      >
        ${cells}
      </dynamic-grid>
    `;
  }
}
