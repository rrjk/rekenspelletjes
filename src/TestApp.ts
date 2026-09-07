import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, state } from 'lit/decorators.js';

import './GoalCardIndexApp/EditableText';
import { type ValueChangedEvent } from './GoalCardIndexApp/EditableText';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor value = 'Ronald';

  static get styles(): CSSResultArray {
    return [
      css`
        editable-text {
          --font-size: 70px;
          --font-weight: bold;
        }
      `,
    ];
  }

  valueChanged(e: ValueChangedEvent) {
    this.value = e.value;
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <editable-text
        value=${this.value}
        @value-changed=${(e: ValueChangedEvent) => this.valueChanged(e)}
      ></editable-text>
      <h2>Piet</h2>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
