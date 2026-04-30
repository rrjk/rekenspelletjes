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
        <numbered-star nmbrToShow="1" color="yellow"></numbered-star>
        <numbered-star nmbrToShow="5" color="red"></numbered-star>
        <numbered-star nmbrToShow="12" color="blue"></numbered-star>
        <numbered-star nmbrToShow="99" color="green"></numbered-star>
        <numbered-star nmbrToShow="100" color="purple"></numbered-star>
        <numbered-star stringsToShow='["A"]' color="orange"></numbered-star>
        <numbered-star
          stringsToShow='["AB","C"]'
          fontSizeFactor="0.5"
          color="pink"
        ></numbered-star>
        <numbered-star nmbrToShow="7" color="yellow" disabled></numbered-star>
        <numbered-star nmbrToShow="3" color="cyan"></numbered-star>
        <numbered-star nmbrToShow="42" color="magenta"></numbered-star>
      </div>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
