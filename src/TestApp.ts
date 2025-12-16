import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './SimpleSumWidget';

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
        simple-sum-widget {
          width: 400px;
          height: 100px;
          background-color: yellow;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <simple-sum-widget
        operand1="999"
        operand2="9"
        operator="divide"
        digitsAnswerBox="4"
      ></simple-sum-widget>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
