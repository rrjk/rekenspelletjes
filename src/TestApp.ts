import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './AdditionSubstractionWithinDecadeGame/AdditionSubstractionWithinDecadeGameIcon';

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

        addition-substraction-within-decade-game-icon {
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
      <addition-substraction-within-decade-game-icon
        variant="aa"
      ></addition-substraction-within-decade-game-icon>
      <div class="vSpace"></div>
      <addition-substraction-within-decade-game-icon
        variant="ab"
      ></addition-substraction-within-decade-game-icon>
      <div class="vSpace"></div>
      <addition-substraction-within-decade-game-icon
        variant="ac"
      ></addition-substraction-within-decade-game-icon>
      <div class="vSpace"></div>
      <addition-substraction-within-decade-game-icon
        variant="ba"
      ></addition-substraction-within-decade-game-icon>
      <div class="vSpace"></div>
      <addition-substraction-within-decade-game-icon
        variant="bb"
      ></addition-substraction-within-decade-game-icon>
      <div class="vSpace"></div>
      <addition-substraction-within-decade-game-icon
        variant="bc"
      ></addition-substraction-within-decade-game-icon>
      <div class="vSpace"></div>
      <addition-substraction-within-decade-game-icon
        variant="ca"
      ></addition-substraction-within-decade-game-icon>
      <div class="vSpace"></div>
      <addition-substraction-within-decade-game-icon
        variant="cb"
      ></addition-substraction-within-decade-game-icon>
      <div class="vSpace"></div>
      <addition-substraction-within-decade-game-icon
        variant="cc"
      ></addition-substraction-within-decade-game-icon>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
