import { html } from 'lit';

// eslint-disable-next-line import/extensions
import { state } from 'lit/decorators.js';

// import { create } from 'mutative';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import './DraggableTargetFraction';
import './DynamicGrid';

interface BasicCellInfo {
  id: number;
  left: number; // Left position within the cell as percentage (0-40%)
  top: number; // Top position within the cell as percentage (0-40%)
}

export abstract class PairMatchingApp<
  PairElement,
  CellInfo,
> extends TimeLimitedGame2 {
  @state()
  private accessor pairsElements: Map<number, PairElement> = new Map<
    number,
    PairElement
  >();

  @state()
  protected accessor cells: {
    basicInfo: BasicCellInfo;
    detailedInfo: CellInfo;
  }[] = [];

  private numberOfPairs = 10;

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

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  constructor() {
    super();
    this.parseUrl();
  }

  protected abstract newRound(): void;

  protected abstract getPairs(numberPairs: number): CellInfo[];
  protected abstract renderPairElement(
    id: string,
    info: CellInfo,
  ): HTMLTemplateResult;

  protected parseUrl(): void {
    console.log(`PairMatchingApp.parseUrl called`);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('numberOfPairs')) {
      this.numberOfPairs = parseInt(urlParams.get('numberOfPairs') || '10', 10);
      if (Number.isNaN(this.numberOfPairs)) this.numberOfPairs = 10;
    }
  }

  static get styles(): CSSResultArray {
    return [...super.styles];
  }

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const cellElements: HTMLTemplateResult[] = [];

    const cells: CellInfo[] = [];

    cells.push(...this.getPairs(this.numberOfPairs));

    for (const cell of cells) {
      if (cell === null) {
        cellElements.push(html`<div class="gridElement"></div>`);
      } else {
        cellElements.push(
          html`<div class="gridElement">
            ${this.renderPairElement(`cell${1}`, cell)}
          </div>`,
        );
      }
    }

    return html`
        <dynamic-grid
          contentAspectRatio="1"
          padding="0"
          style="width: 100%; height: 100%; top: 0;"
        >
          ${cellElements}
        </dynamic-grid>
      </button>
    `;
  }
}
