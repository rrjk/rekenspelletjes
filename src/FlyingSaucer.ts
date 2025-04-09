import {
  css,
  CSSResultGroup,
  html,
  HTMLTemplateResult,
  LitElement,
  unsafeCSS,
} from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';

import { Color, getColorInfo, stringToColor } from './Colors';

@customElement('flying-saucer')
export class FlyingSaurcer extends LitElement {
  @property({ converter: stringToColor })
  accessor color: Color = 'red';

  @property({ type: String })
  accessor content: string = '';

  @property({ type: Boolean })
  accessor disabled: boolean = false;

  static get styles(): CSSResultGroup {
    const ret: CSSResultGroup = [];

    ret.push(css`
      :host {
        display: inline-block;
      }

      svg {
        text-anchor: middle;
        width: 100%;
        height: 100%;
      }

      .oneDigit,
      .twoDigit {
        font-size: 19px;
      }

      .threeDigit {
        font-size: 13px;
      }

      .fourDigit {
        font-size: 10px;
      }

      .beam {
        fill: #ffd983;
      }
      .sides {
        fill: #67757f;
      }
      .outerRing {
        fill: #9aaab4;
      }
      .innerRing {
        fill: #ccd6dd;
      }

      .disabled {
        .outerTop {
          fill: ${unsafeCSS(getColorInfo('grey').mainColorCode)};
        }
        .innerTop {
          fill: ${unsafeCSS(getColorInfo('grey').mainColorCode)};
        }
        .dot {
          fill: ${unsafeCSS(getColorInfo('grey').mainColorCode)};
        }
        text {
          fill: ${unsafeCSS(getColorInfo('grey').mainColorCode)};
        }
      }

      .enabled {
        .outerTop {
          fill: var(--mainColor);
        }
        .innerTop {
          fill: var(--accentColor);
        }
        .dot {
          fill: var(--dotColor);
        }
        text {
          fill: black;
        }
      }
    `);
    return ret;
  }

  /*  */

  render(): HTMLTemplateResult {
    let digitClass: string = '';
    if (this.content.length >= 4) digitClass = 'fourDigit';
    else if (this.content.length >= 3) digitClass = 'threeDigit';
    else if (this.content.length >= 2) digitClass = 'twoDigit';
    else if (this.content.length >= 1) digitClass = 'oneDigit';

    const classes: { [name: string]: string | boolean | number } = {};
    classes.disabled = this.disabled;
    classes.enabled = !this.disabled;
    classes[digitClass] = true;

    let content = '✗';
    if (!this.disabled) content = `${this.content}`;

    let dotColor: string;
    const mainColoredDotsColors: Color[] = [
      'apricot',
      'lime',
      'olive',
      'yellow',
    ];
    if (mainColoredDotsColors.includes(this.color))
      dotColor = getColorInfo(this.color).mainColorCode;
    else dotColor = getColorInfo(this.color).accentColorCode;

    return html`
      <style>
        :host{
          --mainColor: ${unsafeCSS(getColorInfo(this.color).mainColorCode)};
          --accentColor: ${unsafeCSS(getColorInfo(this.color).accentColorCode)};
          --dotColor: ${unsafeCSS(dotColor)};
        }
      </style>
      <svg class="${classMap(classes)}" viewBox="0 3.5 36 36.5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" fill="#000000">
      <g id="SVGRepo_iconCarrier">
        <path class="beam" d="M32.831 20.425c-.689 3.241-9.21 6.221-17.314 4.499S.841 17.013 1.53 13.772s8.587-3.287 16.69-1.564s15.3 4.976 14.611 8.217z"></path>
        <path class="beam" d="M27 40l-2-24l-17-1l-8 25z"></path>
        <ellipse transform="rotate(-78 17.482 15.686)" class="sides" cx="17.481" cy="15.685" rx="7.556" ry="17"></ellipse>
        <path class="sides"  d="M.414 10.977l.414 2.315l32.866 6.986l1.412-2.126z"></path>
        <ellipse transform="rotate(-78 18.013 13.186)" class="outerRing" cx="18.012" cy="13.186" rx="8" ry="18"></ellipse>
        <ellipse transform="rotate(-78 18.43 11.23)" class="innerRing"  cx="18.428" cy="11.229" rx="6" ry="15"></ellipse>
        <path class="outerTop" d="M10.041 7.402c.344-1.621 2.996-4.475 9.843-3.02s8.108 5.141 7.764 6.762c-.344 1.621-4.565 2.097-9.427 1.063s-8.525-3.184-8.18-4.805z"></path>
        <circle class="dot" cx="16.765" cy="19.055" r="1"></circle>
        <circle class="dot" cx="24.798" cy="19.74" r="1"></circle>
        <circle class="dot" cx="32.269" cy="18.261" r="1"></circle>
        <ellipse transform="rotate(-50.811 34.182 14.066)" class="dot" cx="34.183" cy="14.067" rx=".5" ry="1"></ellipse>
        <ellipse transform="rotate(-15.188 2.802 7.396)" class="dot" cx="2.802" cy="7.397" rx="1" ry=".5"></ellipse>
        <circle class="dot" cx="2.924" cy="12.023" r="1"></circle>
        <circle class="dot" cx="9.148" cy="16.413" r="1"></circle>
        <ellipse transform="rotate(-78 19.573 5.85)" class="innerTop"  cx="19.572" cy="5.85" rx="1.5" ry="5"></ellipse>
      </g>
      <g id="SVGRepo_text">
      <text x="15" y="38">${content}</text></svg>
    `;
  }
}
