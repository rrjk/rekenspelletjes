import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import './NumberLine';

type TickMarkType = 'noTickMark' | 'tickMark1' | 'tickMark5' | 'tickMark10';

@customElement('jumping-jan-with-text-overlay')
export class JumpingJanWithTextOverlay extends LitElement {
  @property()
  text1 = '';
  @property()
  text2 = '';
  @property()
  smallestTickmark: TickMarkType = 'noTickMark';

  static get styles(): CSSResultGroup {
    return css`
      .container {
        display: grid;
        grid-template-columns: 40px 60px;
      }
      .numberline {
        display: inline-block;
        background-size: 55px 90px;
        width: 55px;
        height: 90px;
        background-color: transparent;
        border: none;
        outline: none;
        margin: 2px;
        padding: 0;
        color: black;
        font-size: 20px;
        line-height: 78px;
        text-align: center;
      }

      .numberlineNoTickMark {
        background-image: url('images/numberline-icon-no-tickmarks.png');
      }
      .numberlineTickMark1 {
        background-image: url('images/numberline-icon-one-five-ten-tickmarks.png');
      }
      .numberlineTickMark5 {
        background-image: url('images/numberline-icon-five-ten-tickmarks.png');
      }
      .numberlineTickMark10 {
        background-image: url('images/numberline-icon-ten-tickmarks.png');
      }

      .jan {
        display: inline-block;
        background-size: 35px 90px;
        width: 35px;
        height: 90px;
        line-height: 78px;
        background-color: transparent;
        font-size: 25px;
        border: none;
        outline: none;
        color: black;
        text-align: center;
        margin: 2px;
        padding: 0;
        background-image: url('images/Mompitz Jan_Ballon.png');
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        line-height: normal;
      }
    `;
  }

  render(): HTMLTemplateResult {
    let linebreakAfter1 = html``;
    if (this.text1 !== '' && this.text2 !== '') linebreakAfter1 = html`<br />`;
    const text = html`${this.text1}${linebreakAfter1}${this.text2}`;

    let numberlineTickMarkclass = '';
    if (this.smallestTickmark === 'noTickMark')
      numberlineTickMarkclass = 'numberlineNoTickMark';
    else if (this.smallestTickmark === 'tickMark1')
      numberlineTickMarkclass = 'numberlineTickMark1';
    else if (this.smallestTickmark === 'tickMark5')
      numberlineTickMarkclass = 'numberlineTickMark5';
    else if (this.smallestTickmark === 'tickMark10')
      numberlineTickMarkclass = 'numberlineTickMark10';
    else numberlineTickMarkclass = 'numberlineNoTickMark';

    return html`
      <div class="container">
        <div class="jan"></div>
        <div class="numberline ${numberlineTickMarkclass}">${text}</div>
      </div>
    `;
  }
}
