import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './NumberLine';
import { Color, getColorInfo } from './Colors';

type TickMarkType = 'noTickMark' | 'tickMark1' | 'tickMark5' | 'tickMark10';

@customElement('jumping-jan-with-text-overlay')
export class JumpingJanWithTextOverlay extends LitElement {
  @property()
  accessor text1 = '';
  @property()
  accessor text2 = '';
  @property()
  accessor smallestTickmark: TickMarkType = 'noTickMark';
  @property()
  accessor background: Color = 'teal';

  static get styles(): CSSResultGroup {
    return css`
      .container {
        display: grid;
        grid-template-columns: 40px 60px;
        border: black solid 1px;
        border-radius: 15px;
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
        background-image: url('${unsafeCSS(
          new URL(
            '../images/numberline-icon-no-tickmarks.png',
            import.meta.url,
          ),
        )}');
      }
      .numberlineTickMark1 {
        background-image: url('${unsafeCSS(
          new URL(
            '../images/numberline-icon-one-five-ten-tickmarks.png',
            import.meta.url,
          ),
        )}');
      }
      .numberlineTickMark5 {
        background-image: url('${unsafeCSS(
          new URL(
            '../images/numberline-icon-five-ten-tickmarks.png',
            import.meta.url,
          ),
        )}');
      }
      .numberlineTickMark10 {
        background-image: url('${unsafeCSS(
          new URL(
            '../images/numberline-icon-ten-tickmarks.png',
            import.meta.url,
          ),
        )}');
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
        background-image: url('${unsafeCSS(
          new URL('../images/Mompitz Jan_Ballon.png', import.meta.url),
        )}');
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
      <div
        class="container"
        style="background-color: ${getColorInfo(this.background)
          .mainColorCode};"
      >
        <div class="jan"></div>
        <div class="numberline ${numberlineTickMarkclass}">${text}</div>
      </div>
    `;
  }
}
