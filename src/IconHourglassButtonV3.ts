import './IconInfoButton';
import { LitElement, html, css, unsafeCSS, nothing } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import {
  type TimeCode,
  hourGlassIcons,
  optionalStringToTimeCode,
  timeCodeToAttribute,
} from './TimeCodes';

@customElement('icon-hourglass-button-v3')
export class IconHourglassButtonV3 extends LitElement {
  /** What time to use for the hourglass; omit attribute for untimed games */
  @property({
    converter: {
      fromAttribute: optionalStringToTimeCode,
      toAttribute: timeCodeToAttribute,
    },
  })
  accessor timeCode: TimeCode | undefined = undefined;

  /** Which mainCode to link to  */
  get mainCode(): string {
    return 'a';
  }

  /** Which variant to link to  */
  @property()
  accessor variant = 'a';

  /** Description to show */
  get description(): string {
    return '';
  }

  static aspectRatio = 1.8;

  get hasTimeCode(): boolean {
    return this.timeCode !== undefined;
  }

  private get gameUrl(): string {
    const key = this.hasTimeCode
      ? `${this.mainCode}-${this.variant}-${this.timeCode}`
      : `${this.mainCode}-${this.variant}`;
    return `../t?${key}`;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        aspect-ratio: ${this.aspectRatio} / 1;
        container-type: size;
        display: grid;
        justify-items: center;
        align-items: center;
        position: relative;
      }

      a {
        text-decoration: none;
      }

      div#gameButton {
        aspect-ratio: ${this.aspectRatio} / 1;
        display: grid;
        background-color: lightgrey;
        border: 1px solid black;
        justify-items: center;
        align-items: center;
        grid-template-rows: ${100 - 10.5 * this.aspectRatio}% ${10.5 *
          this.aspectRatio}%;
        box-sizing: border-box;
      }

      div#gameButton.with-time {
        grid-template-columns: 56% 33% 11%;
        grid-template-areas:
          'gameIcon hourGlassIcon blank'
          'gameIcon hourGlassIcon informationIcon';
      }

      div#gameButton.no-time {
        grid-template-columns: 89% 11%;
        grid-template-areas:
          'gameIcon blank'
          'gameIcon informationIcon';
      }

      @container (aspect-ratio < ${this.aspectRatio}) {
        div#gameButton {
          width: 100cqw;
          border-radius: 8cqw;
        }
      }

      @container (aspect-ratio >= ${this.aspectRatio}) {
        div#gameButton {
          height: 100cqh;
          border-radius: 8cqh;
        }
      }

      icon-info-button {
        display: block;
        z-index: 2;
        grid-area: informationIcon;
        width: 80%;
        stroke: black;
      }

      #hourGlassIcon {
        grid-area: hourGlassIcon;
        height: 85%;
        width: 85%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      div#gameIcon {
        grid-area: gameIcon;
        position: relative;
        width: 95%;
        height: 95%;
      }

      .timeCodeA {
        background-image: url(${unsafeCSS(hourGlassIcons.a.href)});
      }
      .timeCodeB {
        background-image: url(${unsafeCSS(hourGlassIcons.b.href)});
      }
      .timeCodeC {
        background-image: url(${unsafeCSS(hourGlassIcons.c.href)});
      }

      .stretched-link {
        position: absolute;
        inset: 0; /* top:0; right:0; bottom:0; left:0 */
        z-index: 1;
      }
    `;
  }

  private renderHourGlassIcon(): HTMLTemplateResult | typeof nothing {
    if (!this.hasTimeCode) return nothing;

    const hourGlassClasses = {
      timeCodeA:
        this.timeCode === 'a' ||
        (this.timeCode !== 'b' && this.timeCode !== 'c'),
      timeCodeB: this.timeCode === 'b',
      timeCodeC: this.timeCode === 'c',
    };

    return html`<div
      id="hourGlassIcon"
      class=${classMap(hourGlassClasses)}
    ></div>`;
  }

  protected renderGameIcon(): HTMLTemplateResult {
    return html` <slot></slot> `;
  }

  render(): HTMLTemplateResult {
    /* The iButton reference is used to keep track of the information button event. Once the source property of
     * the ToggleEvent gets widescale support, we no longer need this reference and the button can
     * be obtained from the event.
     * See https://caniuse.com/mdn-api_toggleevent_source for more details on the support of the source property.
     */

    return html`
      <div
        id="gameButton"
        class=${classMap({
          'with-time': this.hasTimeCode,
          'no-time': !this.hasTimeCode,
        })}
      >
        <div id="gameIcon">${this.renderGameIcon()}</div>
        ${this.renderHourGlassIcon()}
        <icon-info-button description=${this.description}></icon-info-button>
      </div>
      <a href=${this.gameUrl} class="stretched-link"></a>
    `;
  }
}
