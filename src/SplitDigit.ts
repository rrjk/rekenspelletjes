import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

export type SplittableNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

@customElement('split-digit')
export class SplitDigit extends LitElement {
  @property({ attribute: false })
  accessor numberToSplit: SplittableNumber = 1;
  @property({ attribute: false })
  accessor firstNumber: SplittableNumber = 7;
  @property({ type: Boolean })
  accessor disabled = false;

  static get styles(): CSSResultGroup {
    return css`
      div {
        font-size: calc(1em + 6vmin);
        text-align: center;
      }
      span {
        display: inline-block;
      }
    `;
  }

  render(): HTMLTemplateResult {
    if (this.disabled) return html``;

    return html`
      <div>${this.numberToSplit}</div>
      <div>
        <span>╱</span><span style="min-width: 0.7em;"></span><span>╲</span>
      </div>
      <div>
        <span>${this.firstNumber}</span><span style="min-width: 1.3em;"></span>
        <span>?</span>
      </div>
    `;
  }
}
