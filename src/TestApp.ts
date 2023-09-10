import { html, css, LitElement, unsafeCSS } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import chroma from 'chroma-js';

import './RealHeight';

@customElement('test-app')
export class TestApp extends LitElement {
  /** Get all static styles */
  static get styles(): CSSResultArray {
    const a = css`
      #div1 {
        height: 400px;
        width: 400px;
        color: black;
        border: 2px black solid;
        background-color: red;
      }
      #div2 {
        height: 400px;
        width: 400px;
        color: black;
        border: 2px black solid;
        background-color: ${unsafeCSS(chroma('red').darken().hex())};
      }
    `;
    return [a];
  }

  protected render(): HTMLTemplateResult {
    return html` <div id="div1">test1</div>
      <div id="div2">test2</div>`;
  }
}
