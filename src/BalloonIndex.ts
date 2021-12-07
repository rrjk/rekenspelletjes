import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
type BalloonColors = 'yellow' | 'purple' | 'yellowPurple' | 'green' | 'blue';
type TimeEnum = '1min' | '3min';

@customElement('balloon-index')
export class BalloonIndex extends LitElement {
  @property()
  ballooncolor: BalloonColors = 'yellow';
  @property()
  time: TimeEnum = '1min';
  @property()
  text1 = '';
  @property()
  text2 = '';
  @property()
  title = '';
  @property()
  href = 'PlusMinBinnenTiental.html?time=60&decade=0&operator=plus';

  static get styles(): CSSResultGroup {
    return css`
      a {
        text-decoration: none;
        color: black;
        border: 1px solid black;
        padding: 2px 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: lightgrey;
        border-radius: 15px;
      }

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

      .hourglass {
        vertical-align: middle;
        height: 75px;
        margin: 2px;
      }
    `;
  }

  render(): HTMLTemplateResult {
    let linebreakAfter1 = html``;
    if (this.text1 !== '' && this.text2 !== '') linebreakAfter1 = html`<br />`;
    const text = html`${this.text1}${linebreakAfter1}${this.text2}`;

    const balloonColorClass =
      this.ballooncolor.charAt(0).toUpperCase() + this.ballooncolor.slice(1);

    let timeText: string;
    let timeLabel: string;
    let hourglassImage: string;
    let url: string;

    if (this.time === '1min') {
      timeText = '(1 minuut)';
      timeLabel = '';
      hourglassImage = 'hourglass_1min.png';
      url = this.href.concat('&time=60');
    } else {
      timeText = '(3 minuten)';
      timeLabel = '';
      hourglassImage = 'hourglass_3min.png';
      url = this.href.concat('&time=180');
    }

    return html`
      <a href="${url}" title="${this.title} ${timeText}">
        <div class="balloon balloon${balloonColorClass}">
          <span class="text">${text}</span>
        </div>
        <img
          class="hourglass"
          alt="${timeLabel}"
          src="images/${hourglassImage}"
        />${timeLabel}
      </a>
    `;
  }
}
