import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './IconMixedSums';

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
        icon-mixed-sums {
          width: 96px;
          height: 96px;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <icon-mixed-sums
        color="lavender"
        puzzlePiece
        maxAnswer="1000"
        maxTable="30"
        plus
        minus
        divide
      ></icon-mixed-sums>
      <icon-mixed-sums
        color="blue"
        maxAnswer="10"
        maxTable="10"
        divide
      ></icon-mixed-sums>
      <icon-mixed-sums
        color="yellow"
        maxAnswer="10"
        maxTable="10"
        plus
      ></icon-mixed-sums>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
