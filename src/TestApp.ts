import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './NumberedStar';

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
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <div class="star-container">
        <!-- Numbered star tests -->
        <numbered-star nmbrToShow="1" color="blue"></numbered-star>
        <numbered-star nmbrToShow="7" color="red"></numbered-star>
        <numbered-star nmbrToShow="42" color="green"></numbered-star>
        <numbered-star nmbrToShow="99" color="purple"></numbered-star>
      </div>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
