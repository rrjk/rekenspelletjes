import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { BalloonColors } from './BalloonWithTextOverlay';
import './BalloonWithTextOverlay';

/** Possible balloon colors */
type TimeEnum = '1min' | '3min';

@customElement('balloon-hourglass-button')
export class BalloonHourglassButton extends LitElement {
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

      .hourglass {
        vertical-align: middle;
        height: 75px;
        margin: 2px;
      }
    `;
  }

  render(): HTMLTemplateResult {
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
        <balloon-with-text-overlay
          .ballooncolor="${this.ballooncolor}"
          .text1="${this.text1}"
          .text2="${this.text2}"
        ></balloon-with-text-overlay>
        <img
          class="hourglass"
          alt="${timeLabel}"
          src="images/${hourglassImage}"
        />${timeLabel}
      </a>
    `;
  }
}
