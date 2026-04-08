import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './IconHourglassButtonV2';

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
        icon-hourglass-button-v2 {
          width: 200px;
          height: 90px;
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

        div:hover {
          background-color: blue;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <icon-hourglass-button-v2
        timeCode="a"
        mainCode="D"
        variant="a"
        description="Plussommen tot de 10 en dan nog een beetje meer"
        ><img src="../images/egg.png" />
      </icon-hourglass-button-v2>
      <icon-hourglass-button-v2
        timeCode="b"
        mainCode="D"
        variant="b"
        description="Plussommen tot de 10 en dat was het"
        ><img src="../images/egg.png" />
      </icon-hourglass-button-v2>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
