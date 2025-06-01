import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './AnalogClock';
import './DigitalClock';
import './SentenceClock';
import { Color, getColorInfo, stringToColor } from './Colors';

@customElement('icon-clock-pair')
export class IconClockPair extends LitElement {
  @property({ type: Boolean })
  private accessor analog = false;
  @property({ type: Boolean })
  private accessor digital = false;
  @property({ type: Boolean })
  private accessor sentence = false;
  @property({ type: Number })
  private accessor hours = 7;
  @property({ type: Number })
  private accessor minutes = 10;
  @property({ type: String, converter: stringToColor })
  private accessor color: Color = 'grey';

  static get styles(): CSSResultGroup {
    return css`
      div.icon {
        height: 95px;
        width: 95px;
        background-color: var(--icon-background-color, white);
        border-radius: 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
      }

      .pair {
        height: 45%;
      }
      .triplet {
        height: 33%;
      }

      analog-clock sentence-clock digital-clock {
        display: block;
        position: relative;
      }
    `;
  }

  render(): HTMLTemplateResult {
    let numberClocks = 0;
    if (this.analog) numberClocks += 1;
    if (this.digital) numberClocks += 1;
    if (this.sentence) numberClocks += 1;

    let cls = '';
    if (numberClocks <= 2) cls = 'pair';
    if (numberClocks === 3) cls = 'triplet';

    return html`
      <style>
        :host {
          --icon-background-color: ${getColorInfo(this.color).mainColorCode};
        }
      </style>
      <div class="icon">
        ${this.analog
          ? html`<analog-clock
              hours=${this.hours}
              minutes=${this.minutes}
              showHourTickmarks
              style="top: 5%"
              class=${cls}
            ></analog-clock>`
          : ''}
        ${this.sentence
          ? html` <sentence-clock
              hours=${this.hours}
              minutes=${this.minutes}
              useWords
              style="top: 10%"
              class=${cls}
            ></sentence-clock>`
          : ''}
        ${this.digital
          ? html`
        <digital-clock
          hours=${this.hours}
          minutes=${this.minutes}
          useWords
          style="top: 10%"
          class=${cls}
        ></digitak-clock>`
          : ''}
      </div>
    `;
  }
}
