import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './CombineToSolveSumGame/CombineToSolveSumGameIcon';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          display: block;
          padding: 20px;
        }

        combine-to-solve-sum-game-icon {
          width: 200px;
          height: 200px;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html` <combine-to-solve-sum-game-icon
      variant="aa"
    ></combine-to-solve-sum-game-icon>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
