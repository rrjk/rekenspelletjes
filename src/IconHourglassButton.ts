import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
type TimeEnum = '1min' | '3min' | '5min';

@customElement('icon-hourglass-button')
export class IconHourglassButton extends LitElement {
  @property()
  accessor time: TimeEnum = '1min';

  // href for the link to be created. Not needed when a shortCode is provided
  @property()
  accessor href = '';
  // shortCode to use to create the link. href should be set to empty when used.
  @property()
  accessor shortCode = '';

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
    let timeSuffix: string;
    let hourglassImage: URL;
    let url: string;

    if (this.time === '1min') {
      timeText = '(1 minuut)';
      hourglassImage = new URL('../images/hourglass_1min.png', import.meta.url);
      timeSuffix = '&time=60';
    } else if (this.time === '3min') {
      timeText = '(3 minuten)';
      hourglassImage = new URL('../images/hourglass_3min.png', import.meta.url);
      timeSuffix = '&time=180';
    } else {
      timeText = '(5 minuten)';
      hourglassImage = new URL('../images/hourglass_5min.png', import.meta.url);
      timeSuffix = '&time=300';
    }

    if (this.href === '' && this.shortCode !== '')
      url = `../s?${this.shortCode}`;
    else url = this.href.concat(timeSuffix);

    return html`
      <a href="${url}">
        <slot></slot>
        <img class="hourglass" alt="${timeText}" src="${hourglassImage}" />
      </a>
    `;
  }
}
