import { html, css, LitElement, unsafeCSS } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { darken, lighten } from 'color2k';

// import './RealHeight';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    const a = css`
      #div1 {
        height: 150px;
        width: 400px;
        color: black;
        border: 2px black solid;
        background-color: #e6194b;
      }
      #div2 {
        height: 150px;
        width: 400px;
        color: black;
        border: 2px black solid;
        background-color: ${unsafeCSS(darken('#E6194B', 0.1))};
      }
      #div3 {
        height: 150px;
        width: 400px;
        color: black;
        border: 2px black solid;
        background-color: ${unsafeCSS(lighten('#E6194B', 0.1))};
      }
    `;

    return [a];
  }

  protected render(): HTMLTemplateResult {
    return html` <div id="div1">test1</div>
      <div id="div2">test2</div>
      <div id="div3">Test3</div>`;
  }
}
