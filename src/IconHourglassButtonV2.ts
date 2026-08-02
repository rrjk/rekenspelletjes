import { LitElement, html, css, unsafeCSS, nothing } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
/* The following import are only used to store the iButton reference. Once the source property of
 * the ToggleEvent gets widescale support, these imports can be removed and the button can
 * be obtained from the event.
 * See https://caniuse.com/mdn-api_toggleevent_source for more details on the support of the source property.
 */
import { createRef, Ref, ref } from 'lit/directives/ref.js';

import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
} from '@floating-ui/dom';

import {
  type TimeCode,
  hourGlassIcons,
  optionalStringToTimeCode,
  timeCodeToAttribute,
} from './TimeCodes';

@customElement('icon-hourglass-button-v2')
export class IconHourglassButton extends LitElement {
  /** What time to use for the hourglass; omit attribute for untimed games */
  @property({
    converter: {
      fromAttribute: optionalStringToTimeCode,
      toAttribute: timeCodeToAttribute,
    },
  })
  accessor timeCode: TimeCode | undefined = undefined;

  /** Which mainCode to link to  */
  @property()
  accessor mainCode = 'a';

  /** Which variant to link to  */
  @property()
  accessor variant = 'a';

  /** Description to show */
  @property()
  accessor description = '';

  /* The iButton reference is used to keep track of the information button event. Once the source property of
   * the ToggleEvent gets widescale support, we no longer need this reference and the button can
   * be obtained from the event.
   * See https://caniuse.com/mdn-api_toggleevent_source for more details on the support of the source property.
   */
  iButton: Ref<HTMLButtonElement> = createRef();

  descriptionDialogCleanup = () => {
    /*nothing*/
  };

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
        aspect-ratio: 1.8 /1;
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
        aspect-ratio: 1.8 / 1;
        display: grid;
        background-color: lightgrey;
        border: 1px solid black;
        justify-items: center;
        align-items: center;
        grid-template-rows: 81% 19%;
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

      @container (aspect-ratio < 1.8) {
        div#gameButton {
          width: 100cqw;
          border-radius: 8cqw;
        }
      }

      @container (aspect-ratio >= 1.8) {
        div#gameButton {
          height: 100cqh;
          border-radius: 8cqh;
        }
      }

      button#infoButton {
        aspect-ratio: 1;
        width: 80%;
        grid-area: informationIcon;
        border: none;
        margin: 0;
        padding: 0;
        background-color: transparent;
        z-index: 2;
        stroke: black;
      }

      svg {
        width: 100%;
        height: 100%;
        font-size: 70px;
        dominant-baseline: middle;
        text-anchor: middle;
        font-family: 'Georgia';
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

      dialog#description {
        margin: 0;
        inset: auto;
        max-width: 50%;
        width: max-content;

        background-color: #efefef;
        border: 1px grey solid;
      }

      #description:focus {
        outline: none;
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

  handleDescriptionToggle(evt: ToggleEvent) {
    if (evt.newState === 'open') {
      /* The iButton reference is used to keep track of the information button event. Once the source property of
       * the ToggleEvent gets widescale support, we no longer need this reference and the button can
       * be obtained from the event using
       * const button = evt.source as HTMLButtonElement;
       * See https://caniuse.com/mdn-api_toggleevent_source for more details on the support of the source property.
       */

      const button = this.iButton.value;
      const dialog = evt.target as HTMLDialogElement;
      if (button && dialog) {
        this.descriptionDialogCleanup = autoUpdate(button, dialog, () => {
          computePosition(button, dialog, {
            placement: 'top',
            strategy: 'fixed',
            middleware: [offset(4), flip(), shift({ padding: 5 })],
          })
            .then(({ x, y }) => {
              dialog.style.left = `${x}px`;
              dialog.style.top = `${y}px`;
            })
            .catch(() => {
              // An error occured in the compute Position, we simply don't change the coordinates, the description will appear on the middle of the viewport.
              console.error(
                `computePosition failed - description shown at wrong location`,
              );
            });
        });
      }
    } else {
      if (this.descriptionDialogCleanup) {
        this.descriptionDialogCleanup();
      }
    }
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
        <div id="gameIcon">
          <slot></slot>
        </div>
        ${this.renderHourGlassIcon()}
        <button
          id="infoButton"
          popovertarget="description"
          ${ref(this.iButton)}
        >
          <svg viewBox="-50 -50 100 100">
            <circle
              cx="0"
              cy="0"
              r="45"
              fill="none"
              stroke="black"
              stroke-width="5px"
            />
            <text x="0" y="7">i</text>
          </svg>
        </button>
      </div>
      <a href=${this.gameUrl} class="stretched-link"></a>
      <dialog
        id="description"
        popover
        @toggle=${(evt: ToggleEvent) => this.handleDescriptionToggle(evt)}
      >
        ${this.description}
      </dialog>
    `;
  }
}
