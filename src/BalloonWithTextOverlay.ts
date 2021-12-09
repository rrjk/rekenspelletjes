import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
export type BalloonColors =
  | 'yellow'
  | 'purple'
  | 'yellowPurple'
  | 'green'
  | 'blue';

@customElement('balloon-with-text-overlay')
export class BalloonIndex extends LitElement {
  @property()
  ballooncolor: BalloonColors = 'yellow';
  @property()
  text1 = '';
  @property()
  text2 = '';

  static get styles(): CSSResultGroup {
    return css`
      .balloon {
        display: inline-block;
        background-size: 75px 90px;
        width: 75px;
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
      }

      .balloonBlue {
        background-image: url('images/balloon-blue.png');
      }

      .balloonPurple {
        background-image: url('images/balloon-purple.png');
      }

      .balloonGreen {
        background-image: url('images/balloon-green.png');
      }

      .balloonYellow {
        background-image: url('images/balloon-yellow.png');
      }

      .balloonYellowPurple {
        background-image: url('images/balloon-yellow-purple.png');
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

    const balloonColorClass =
      this.ballooncolor.charAt(0).toUpperCase() + this.ballooncolor.slice(1);

    return html`
      <div class="balloon balloon${balloonColorClass}">
        <span class="text">${text}</span>
      </div>
    `;
  }
}
