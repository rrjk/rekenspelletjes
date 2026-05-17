import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './NumberedStar';
import './IconHourglassButtonV2';
import './MixedSumsGame/MixedSumsGameIcon';

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

        .star-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        numbered-star {
          height: 100px;
          width: 120px;
        }

        .icon-hourglass-test-section {
          margin-top: 32px;
        }

        .icon-hourglass-test-section h2 {
          margin: 0 0 16px;
          font-size: 1.1rem;
        }

        .icon-hourglass-test-container {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: start;
        }

        .icon-hourglass-test-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .icon-hourglass-test-item p {
          margin: 0;
          font-size: 0.9rem;
        }

        icon-hourglass-button-v2 {
          width: 200px;
          aspect-ratio: 1.8 / 1;
        }

        mixed-sums-game-icon {
          height: 100%;
          width: 100%;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <div class="star-container">
        <numbered-star nmbrToShow="1" color="blue"></numbered-star>
        <numbered-star nmbrToShow="7" color="red"></numbered-star>
        <numbered-star nmbrToShow="42" color="green"></numbered-star>
        <numbered-star nmbrToShow="99" color="purple"></numbered-star>
      </div>

      <section class="icon-hourglass-test-section">
        <h2>icon-hourglass-button-v2</h2>
        <div class="icon-hourglass-test-container">
          <div class="icon-hourglass-test-item">
            <p>With timeCode</p>
            <icon-hourglass-button-v2
              timeCode="a"
              mainCode="AC"
              variant="aa"
              description="Timed example (1 minuut)"
            >
              <mixed-sums-game-icon variant="aa"></mixed-sums-game-icon>
            </icon-hourglass-button-v2>
          </div>
          <div class="icon-hourglass-test-item">
            <p>Without timeCode</p>
            <icon-hourglass-button-v2
              mainCode="H"
              variant="aa"
              description="Untimed example (no hourglass)"
            >
              <mixed-sums-game-icon variant="aa"></mixed-sums-game-icon>
            </icon-hourglass-button-v2>
          </div>
        </div>
      </section>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
