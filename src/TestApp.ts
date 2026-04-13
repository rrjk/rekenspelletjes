import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './MultiplicationTablesBalloonGameIcon';
import './MultiplicationTablesBalloonHourglassGameIcon';

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
          width: 100px;
          background-color: blue;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
        }

        div {
          height: 200px;
          width: 200px;
          aspect-ratio: 2 / 1;
          background-color: red;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <multiplication-tables-balloon-game-icon
        variant="a"
      ></multiplication-tables-balloon-game-icon>
      <multiplication-tables-balloon-hourglass-game-icon
        variant="a"
        timeCode="b"
      ></multiplication-tables-balloon-hourglass-game-icon>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
