import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './NumberedStar';
import './MompitzStar';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          display: block;
          padding: 20px;
        }

        .star-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        numbered-star {
          height: 100px;
          width: 120px;
        }

        mompitz-star {
          height: 100px;
          width: auto;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <div class="star-container">
        <!-- Mompitz star tests -->
        <mompitz-star stringsToShow='["M"]' color="blue"></mompitz-star>
        <mompitz-star stringsToShow='["7"]' color="red"></mompitz-star>
        <mompitz-star
          stringsToShow='["34+40", ""]'
          fontSizeFactor="0.45"
          color="green"
        ></mompitz-star>
        <mompitz-star
          stringsToShow='["34+40","58-30"]'
          fontSizeFactor="0.45"
          color="purple"
        ></mompitz-star>
      </div>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
