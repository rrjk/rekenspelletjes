import { html, css } from 'lit';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';

// eslint-disable-next-line import/extensions
import { range } from 'lit/directives/range.js';

import { PairMatchingApp } from './PairMatchingApp';
import { DraggableTargetFraction } from './DraggableTargetFraction';
import { GameLogger } from './GameLogger';

interface FractionInfo {
  denumerator: number;
  numerator: number;
}

@customElement('fraction-pair-matching-app')
export class FractionMatchingGameApp extends PairMatchingApp<
  DraggableTargetFraction,
  FractionInfo
> {
  private gameLogger = new GameLogger('I', '');

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

  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Sleep de breuken die hetzelfde zijn over elkaar.</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Breuken paren spel`;
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  protected parseUrl(): void {
    super.parseUrl();
    // const urlParams = new URLSearchParams(window.location.search);
  }

  newRound() {
    //
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        draggable-target-fraction {
          width: 50%;
          aspect-ratio: 1;
        }
      `,
    ];
  }

  renderPairElement(id: string, info: FractionInfo): HTMLTemplateResult {
    return html`
      <draggable-target-fraction
        numerator="${info.numerator}"
        denumerator="${info.denumerator}"
      ></draggable-target-fraction>
    `;
  }

  getPairs(numberPairs: number): FractionInfo[] {
    const ret: FractionInfo[] = [];
    for (const i of range(numberPairs)) {
      ret.push({ numerator: i, denumerator: 2 });
      ret.push({ numerator: i, denumerator: 4 });
    }
    return ret;
  }
}
/*         .dropTargetList=${this.fractions.map(el => ({
          element: el,
          dropType: 'dropOk',
        }))}
*/
