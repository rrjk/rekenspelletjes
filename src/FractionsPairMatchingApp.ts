import { html, css } from 'lit';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';

import { PairMatchingApp } from './PairMatchingApp';
import { GameLogger } from './GameLogger';

import './FractionElement';

interface FractionInfo {
  denumerator: number;
  numerator: number;
}

@customElement('fraction-pair-matching-app')
export class FractionMatchingGameApp extends PairMatchingApp<FractionInfo> {
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

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        fraction-element {
          width: 100%;
          aspect-ratio: 1;
        }
      `,
    ];
  }

  renderPairElement(info: FractionInfo): HTMLTemplateResult {
    return html`
      <fraction-element
        numerator="${info.numerator}"
        denumerator="${info.denumerator}"
      ></fraction-element>
    `;
  }

  getPair(): { exercise: FractionInfo; answer: FractionInfo } {
    const ret = {
      exercise: { numerator: 1, denumerator: 2 },
      answer: { numerator: 2, denumerator: 4 },
    };
    return ret;
  }
}
