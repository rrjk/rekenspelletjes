import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import { getRealViewportHeight } from './RealHeight';

@customElement('pixel-art-color-selector')
export class SentenceClock extends LitElement {
  @property({ type: Number })
  horizontalPixels = 5;
  @property({ type: Number })
  verticalPixels = 5;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      .buttonField {
        width: 100%;
        height: 100%;
      }

      button {
        width: calc(100% / var(--numberColumns));
        height: calc(100% / var(--numberRows));
        margin: 0;
        padding: 0;
        border: 1px black solid;
      }
    `;
  }

  render(): HTMLTemplateResult {
    const buttonArray: HTMLTemplateResult[] = [];
    for (let row = 0; row < this.verticalPixels; row++) {
      for (let column = 0; column < this.horizontalPixels; column++) {
        buttonArray.push(html`<button></button>`);
      }
    }

    return html`
      <style>
        :host {
          --numberColumns: ${this.horizontalPixels};
          --numberRows: ${this.verticalPixels};
        }
      </style>
      <div class="buttonField">${buttonArray}</div>
    `;
  }
}
