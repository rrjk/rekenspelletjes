import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, state } from 'lit/decorators.js';

import './PuzzlePhoto';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor numberVisiblePieces = 1;

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          display: block;
        }
        div#im {
          height: 100px;
          width: 100px;
          background-color: green;
        }
        img {
          object-fit: contain;
          max-width: 100px;
          max-height: 100px;
        }
      `,
    ];
  }
  protected renderTest(): HTMLTemplateResult {
    return html`<puzzle-photo
      numberVisiblePieces=${this.numberVisiblePieces}
    ></puzzle-photo>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
