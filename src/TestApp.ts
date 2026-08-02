import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './MathStepsIndexApp/MathStepSumsIcon';

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

        div.space {
          display: block;
          position: relative;
          height: 20px;
        }

        math-step-sums-icon#largeWide {
          width: 800px;
          height: 36px;
        }
        math-step-sums-icon#mediumWide {
          width: 500px;
          height: 24px;
        }
        math-step-sums-icon#smallWide {
          width: 300px;
          height: 12px;
        }

        math-step-sums-icon#largeTall {
          width: 636px;
          height: 50px;
        }
        math-step-sums-icon#mediumTall {
          width: 424px;
          height: 40px;
        }
        math-step-sums-icon#smallTall {
          width: 212px;
          height: 30px;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html` <math-step-sums-icon
        id="smallWide"
        math-step="PlusMinusTill10"
      ></math-step-sums-icon>
      <div class="space"></div>
      <math-step-sums-icon
        id="mediumWide"
        math-step="PlusMinusTill10"
      ></math-step-sums-icon>
      <div class="space"></div>
      <math-step-sums-icon
        id="largeWide"
        math-step="PlusMinusTill10"
      ></math-step-sums-icon>
      <div class="space"></div>
      <math-step-sums-icon
        id="smallTall"
        math-step="PlusMinusTill10"
      ></math-step-sums-icon>
      <div class="space"></div>
      <math-step-sums-icon
        id="mediumTall"
        math-step="PlusMinusTill10"
      ></math-step-sums-icon>
      <div class="space"></div>
      <math-step-sums-icon
        id="largeTall"
        math-step="PlusMinusTill10"
      ></math-step-sums-icon>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
