import { html, css } from 'lit';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';

import { PairMatchingApp } from './PairMatchingApp';
import { GameLogger } from './GameLogger';

import './FractionElement';

import { Fraction } from './Fraction';

@customElement('fraction-pair-matching-app')
export class FractionMatchingGameApp extends PairMatchingApp<Fraction> {
  private gameLogger = new GameLogger('I', '');

  private fractionPairs: { exercise: Fraction; answer: Fraction }[] = [
    { exercise: new Fraction(3, 4), answer: new Fraction(6, 8) },
    { exercise: new Fraction(1, 2), answer: new Fraction(4, 8) },
    { exercise: new Fraction(1, 3), answer: new Fraction(3, 9) },
    { exercise: new Fraction(2, 5), answer: new Fraction(8, 20) },
    { exercise: new Fraction(4, 5), answer: new Fraction(8, 10) },
    { exercise: new Fraction(2, 3), answer: new Fraction(4, 6) },
    { exercise: new Fraction(1, 4), answer: new Fraction(3, 12) },
    { exercise: new Fraction(7, 8), answer: new Fraction(14, 16) },
    { exercise: new Fraction(4, 10), answer: new Fraction(12, 30) },
    { exercise: new Fraction(3, 5), answer: new Fraction(6, 10) },
    { exercise: new Fraction(9, 10), answer: new Fraction(90, 100) },
  ];

  private nextFactionPair = 0;

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

  renderPairElement(info: Fraction): HTMLTemplateResult {
    return html` <fraction-element .fraction="${info}"></fraction-element> `;
  }

  getPair(): { exercise: Fraction; answer: Fraction } {
    const ret = this.fractionPairs[this.nextFactionPair];
    this.nextFactionPair += 1;
    if (this.nextFactionPair === this.fractionPairs.length)
      this.nextFactionPair = 0;
    return ret;
  }

  pairEqual(fraction1: Fraction, fraction2: Fraction) {
    return fraction1.equal(fraction2);
  }
}
