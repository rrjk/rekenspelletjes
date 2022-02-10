import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';
import './BalloonWithTextOverlay';

/** Possible balloon colors */
type TimeEnum = '1min' | '3min';

@customElement('icon-hourglass-button')
export class IconHourglassButton extends LitElement {
  @property()
  time: TimeEnum = '1min';
  @property()
  title = '';
  @property()
  href = '';

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
    let hourglassImage: URL;
    let url: string;

    if (this.time === '1min') {
      timeText = '(1 minuut)';
      timeLabel = '';
      hourglassImage = new URL('../images/hourglass_1min.png', import.meta.url);
      url = this.href.concat('&time=60');
    } else {
      timeText = '(3 minuten)';
      timeLabel = '';
      hourglassImage = new URL('../images/hourglass_3min.png', import.meta.url);
      url = this.href.concat('&time=180');
    }

    return html`
      <a href="${url}" title="${this.title} ${timeText}">
        <slot></slot>
        <img
          class="hourglass"
          alt="${timeLabel}"
          src="${hourglassImage}"
        />${timeLabel}
      </a>
    `;
  }
}
