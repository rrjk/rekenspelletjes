import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './SimpleSplitWidget';

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
        simple-split-widget {
          width: 500px;
          height: 500px;
        }
      `,
    ];
  }
  protected renderTest(): HTMLTemplateResult {
    return html` <simple-split-widget
      numberToSplit="3"
      firstSplit="2"
    ></simple-split-widget>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
