import { LitElement, html, css } from 'lit';
import type {
  PropertyDeclarations,
  HTMLTemplateResult,
  CSSResultGroup,
} from 'lit';

export class ScoreBox extends LitElement {
  numberOk: number;
  numberNok: number;

  static get properties(): PropertyDeclarations {
    return {
      numberOk: { type: Number },
      numberNok: { type: Number },
    };
  }

  static get styles(): CSSResultGroup {
    return css`
      div {
        border-style: solid;
        border-color: black;
        padding: 10% 10% 10% 10%;
        display: inline-block;
        width: calc(100% - 6px);
        font-size: calc(0.25 * var(--scoreBoxWidth));
      }

      .ScoreSign {
        display: inline-block;
        width: 1em;
      }

      .GreenText {
        color: lightgreen;
      }

      .RedText {
        color: red;
      }
    `;
  }

  constructor() {
    super();
    this.numberOk = 0;
    this.numberNok = 0;
  }

  increaseOk(): void {
    this.numberOk += 1;
  }

  increaseNok(): void {
    this.numberNok += 1;
  }

  resetScore(): void {
    this.numberOk = 0;
    this.numberNok = 0;
  }

  render(): HTMLTemplateResult {
    return html`
        <div>
          <span class="ScoreSign GreenText">✓</span> : ${this.numberOk}
          </br>
          <span class="ScoreSign RedText">✗</span> : ${this.numberNok}
        </div>
    `;
  }
}

customElements.define('score-box', ScoreBox);
