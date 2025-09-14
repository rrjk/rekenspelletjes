import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './HandFace';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          display: block;
        }
        hand-face {
          width: 130px;
          height: 80px;
        }
      `,
    ];
  }
  protected renderTest(): HTMLTemplateResult {
    return html` <hand-face nmbrToShow="1"> </hand-face>
      <hand-face nmbrToShow="2"> </hand-face>
      <hand-face nmbrToShow="3"> </hand-face>
      <hand-face nmbrToShow="4"> </hand-face>
      <hand-face nmbrToShow="5"> </hand-face>
      <hand-face nmbrToShow="6"> </hand-face>
      <hand-face nmbrToShow="7"> </hand-face>
      <hand-face nmbrToShow="8"> </hand-face>
      <hand-face nmbrToShow="9"> </hand-face>
      <hand-face nmbrToShow="10"> </hand-face>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
