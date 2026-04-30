import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './NumberedKite';

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

        numbered-kite {
          height: 100px;
          width: 200px;
          background-color: #f0f0f0;
        }

        div.vSpace {
          height: 20px;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <numbered-kite
        .nmbrToShow=${123}
        .tailLength=${'long'}
        .isDisabled=${false}
        .color=${'green'}
      ></numbered-kite>
      <div class="vSpace"></div>
      <numbered-kite
        .nmbrToShow=${25}
        .tailLength=${'long'}
        .isDisabled=${false}
        .color=${'lavender'}
      ></numbered-kite>
      <div class="vSpace"></div>
      <numbered-kite
        .stringsToShow=${['3+4', '8-3']}
        .fontSizeFactor=${0.6}
        .tailLength=${'short'}
        .isDisabled=${false}
        .color=${'blue'}
      ></numbered-kite>
      <div class="vSpace"></div>
      <numbered-kite
        .nmbrToShow=${15}
        .tailLength=${'long'}
        .disabled=${true}
        .color=${'cyan'}
      ></numbered-kite>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
