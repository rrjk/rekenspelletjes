import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './ZeppelinImageV2';
import './RocketImageV2';
import './NumberedBalloon';
import './MultiplicationTablesBalloonGame/MultiplicationTablesBalloonGameIcon';
import './MultiplicationTablesBalloonGame/MultiplicationTablesBalloonHourglassGameIcon';
import './MixedSumsGameIcon';

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

        multiplication-tables-balloon-game-icon {
          height: 200px;
          width: 100px;
        }

        multiplication-tables-balloon-hourglass-game-icon {
          width: 150px;
        }

        div.vSpace {
          height: 20px;
        }

        mixed-sums-game-icon {
          width: 200px;
          height: 200px;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <multiplication-tables-balloon-hourglass-game-icon
        variant="af"
        timeCode="a"
      >
      </multiplication-tables-balloon-hourglass-game-icon>
      <div class="vSpace"></div>
      <mixed-sums-game-icon variant="af"></mixed-sums-game-icon>
      <div class="vSpace"></div>
      <mixed-sums-game-icon variant="bc"></mixed-sums-game-icon>
      <div class="vSpace"></div>
      <mixed-sums-game-icon variant=""></mixed-sums-game-icon>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
