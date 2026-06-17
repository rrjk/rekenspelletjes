// https://nrcd.sites.uu.nl/wp-content/uploads/sites/244/2019/04/Wg-08-NRCD-2019-Basisvaardigheden-de-baas.pdf

import {
  LitElement,
  HTMLTemplateResult,
  html,
  CSSResultArray,
  css,
  unsafeCSS,
} from 'lit';
import { customElement } from 'lit/decorators.js';
import { getColorInfo } from '../Colors';

interface ButtonInfo {
  id: string;
  startColumn: number;
  width: number;
  startRow: number;
  height: number;
  content: string;
}

@customElement('math-wall-index-app')
export class MathWallIndexApp extends LitElement {
  static get phase2Buttons(): ButtonInfo[] {
    return [
      {
        id: 'b65p22',
        startColumn: 1,
        width: 2,
        startRow: 1,
        height: 1,
        content: '65 + 22',
      },
      {
        id: 'b56p20',
        startColumn: 3,
        width: 2,
        startRow: 1,
        height: 1,
        content: '56 + 20',
      },
      {
        id: 'b76p8',
        startColumn: 5,
        width: 3,
        startRow: 1,
        height: 1,
        content: '76 + 8',
      },
      {
        id: 'b3t4',
        startColumn: 8,
        width: 2,
        startRow: 1,
        height: 1,
        content: '3 × 4',
      },
      {
        id: 'b56m8',
        startColumn: 10,
        width: 3,
        startRow: 1,
        height: 1,
        content: '56 - 8',
      },
      {
        id: 'b76m20',
        startColumn: 13,
        width: 2,
        startRow: 1,
        height: 1,
        content: '76 - 20',
      },
      {
        id: 'b67m22',
        startColumn: 15,
        width: 2,
        startRow: 1,
        height: 1,
        content: '67 - 22',
      },
      {
        id: 'b33p5',
        startColumn: 1,
        width: 2,
        startRow: 2,
        height: 1,
        content: '33 + 5',
      },
      {
        id: 'b50p20',
        startColumn: 3,
        width: 2,
        startRow: 2,
        height: 1,
        content: '50 + 20',
      },
      {
        id: 'b80p4',
        startColumn: 5,
        width: 2,
        startRow: 2,
        height: 1,
        content: '80 + 4',
      },
      {
        id: 'b76pi80',
        startColumn: 7,
        width: 2,
        startRow: 2,
        height: 1,
        content: '76 + .. 80',
      },
      {
        id: 'b56mi50',
        startColumn: 9,
        width: 2,
        startRow: 2,
        height: 1,
        content: '56 - .. = 50',
      },
      {
        id: 'b50m2',
        startColumn: 11,
        width: 2,
        startRow: 2,
        height: 1,
        content: '50 - 2',
      },
      {
        id: 'b70m20',
        startColumn: 13,
        width: 2,
        startRow: 2,
        height: 1,
        content: '70 - 20',
      },
      {
        id: 'b57-2',
        startColumn: 15,
        width: 2,
        startRow: 2,
        height: 1,
        content: '57 - 2',
      },
      {
        id: 'num100',
        startColumn: 1,
        width: 16,
        startRow: 3,
        height: 1,
        content: 'Getalbegrip tot 100',
      },
    ];
  }

  static get phase1Buttons(): ButtonInfo[] {
    return [
      {
        id: 'b15p2',
        startColumn: 1,
        width: 3,
        startRow: 1,
        height: 1,
        content: '15 + 2',
      },
      {
        id: 'b6p8',
        startColumn: 4,
        width: 4,
        startRow: 1,
        height: 1,
        content: '6 + 8',
      },
      {
        id: 'b16m8',
        startColumn: 8,
        width: 4,
        startRow: 1,
        height: 1,
        content: '16 - 8',
      },
      {
        id: 'b17m2',
        startColumn: 12,
        width: 3,
        startRow: 1,
        height: 1,
        content: '17 - 2',
      },
      {
        id: 'b5p2',
        startColumn: 1,
        width: 2,
        startRow: 2,
        height: 1,
        content: '5 + 2',
      },
      {
        id: 'b10p4',
        startColumn: 3,
        width: 2,
        startRow: 2,
        height: 1,
        content: '10 + 4',
      },
      {
        id: 'b6pi10',
        startColumn: 5,
        width: 2,
        startRow: 2,
        height: 1,
        content: '6 + .. = 10',
      },
      {
        id: 'split',
        startColumn: 7,
        width: 2,
        startRow: 2,
        height: 2,
        content: 'Splitsen',
      },
      {
        id: 'b16mi10',
        startColumn: 9,
        width: 2,
        startRow: 2,
        height: 1,
        content: '16 - ... = 10',
      },
      {
        id: 'b10m2',
        startColumn: 11,
        width: 2,
        startRow: 2,
        height: 1,
        content: '10 - 2',
      },
      {
        id: 'b7m2',
        startColumn: 13,
        width: 2,
        startRow: 2,
        height: 1,
        content: '7 - 2',
      },
      {
        id: 'num10',
        startColumn: 1,
        width: 6,
        startRow: 3,
        height: 1,
        content: 'Getalbegrip tot 10',
      },
      {
        id: 'num20',
        startColumn: 9,
        width: 6,
        startRow: 3,
        height: 1,
        content: 'Getalbegrip tot 20',
      },
    ];
  }

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
          height: 100vh;
        }

        a.stretched-link {
          text-decoration: none;
          position: absolute;
          inset: 0; /* top:0; right:0; bottom:0; left:0 */
          z-index: 1;
        }

        div#wall {
          height: 80%;
          display: grid;
          grid-template-columns: 100%;
          grid-template-rows: repeat(5, 18.8%);
          grid-template-areas:
            'phase5'
            'phase4'
            'phase3'
            'phase2'
            'phase1';
          gap: 1.5%;
        }

        div#phase2 {
          grid-area: phase2;
          display: grid;
          grid-template-columns: repeat(16, 1fr);
          grid-template-rows: repeat(3, 32.6%);
          align-items: center;
          justify-items: center;
          gap: 1%;
        }

        div#phase1 {
          grid-area: phase1;
          display: grid;
          grid-template-columns: repeat(14, 1fr);
          grid-template-rows: repeat(3, 32.6%);
          align-items: center;
          justify-items: center;
          gap: 1%;
        }

        div.button {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${unsafeCSS(
            getColorInfo('lavender').mainColorCode,
          )};
          border: 3px solid
            ${unsafeCSS(getColorInfo('lavender').accentColorCode)};
          border-radius: 10px;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
      `,
      MathWallIndexApp.phase1Buttons.map(
        button => css`
          div#${unsafeCSS(button.id)} {
            grid-column: ${button.startColumn} / span ${button.width};
            grid-row: ${button.startRow} / span ${button.height};
          }
        `,
      ),
      MathWallIndexApp.phase2Buttons.map(
        button => css`
          div#${unsafeCSS(button.id)} {
            grid-column: ${button.startColumn} / span ${button.width};
            grid-row: ${button.startRow} / span ${button.height};
          }
        `,
      ),
    ];
  }

  renderButton(button: ButtonInfo): HTMLTemplateResult {
    const url = new URL(
      `../rekenspelletjes/${button.id}-index.html`,
      import.meta.url,
    );
    return html`
      <div class="button" id=${button.id}>
        ${button.content}
        <a href=${url.href} class="stretched-link"></a>
      </div>
    `;
  }

  render(): HTMLTemplateResult {
    return html`<h1>Rekenmuurtje</h1>

      <div id="wall">
        <div id="phase5"></div>
        <div id="phase4"></div>
        <div id="phase3"></div>
        <div id="phase2">
          ${MathWallIndexApp.phase2Buttons.map(button =>
            this.renderButton(button),
          )}
        </div>
        <div id="phase1">
          ${MathWallIndexApp.phase1Buttons.map(button =>
            this.renderButton(button),
          )}
        </div>
      </div> `;
  }
}
