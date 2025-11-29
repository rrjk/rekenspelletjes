import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './NumberedBalloon';

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
        numbered-balloon {
          width: 75px;
          height: auto;
        }
      `,
    ];
  }
  protected renderTest(): HTMLTemplateResult {
    return html` <numbered-balloon
      color="purple"
      stringsToShow='["×","2,3,4", "5,6,7,8","9,10"]'
      fontSizeFactor="0.35"
    ></numbered-balloon>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
