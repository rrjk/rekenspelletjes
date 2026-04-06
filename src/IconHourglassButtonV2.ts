import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

import { computePosition, flip, shift, offset } from '@floating-ui/dom';

import { type TimeCode, hourGlassIcons, stringToTimeCode } from './TimeCodes';

@customElement('icon-hourglass-button-v2')
export class IconHourglassButton extends LitElement {
  /** What time to use for the hourglass */
  @property({ converter: stringToTimeCode })
  accessor timeCode: TimeCode = 'a';

  /** Which gameCode to link to  */
  @property()
  accessor gameCode = 'a';

  /** Description to show */
  @property()
  accessor description = '';

  /** Reference to the description dialog. */
  descriptionRef: Ref<HTMLDialogElement> = createRef();
  /** Reference to the i button */
  iButtonRef: Ref<SVGElement> = createRef();

  static get styles(): CSSResultGroup {
    return css`
      :host {
        aspect-ratio: 2 /1;
        container-type: size;
        display: grid;
        justify-items: center;
        align-items: center;
      }

      a {
        text-decoration: none;
      }

      div#gameButton {
        aspect-ratio: 2 / 1;
        display: grid;
        background-color: lightgrey;
        border: 1px solid black;
        justify-items: center;
        align-items: center;
        grid-template-rows: 81% 19%;
        grid-template-columns: 57% 33% 10%;
        grid-template-areas:
          'gameIcon hourGlassIcon blank'
          'gameIcon hourGlassIcon informationIcon';
        box-sizing: border-box;
      }

      div#gameButton.touched {
        background-color: yellow;
      }

      @container (aspect-ratio < 2) {
        div#gameButton {
          width: 100cqw;
          border-radius: 8cqw;
        }
      }

      @container (aspect-ratio >= 2) {
        div#gameButton {
          height: 100cqh;
          border-radius: 8cqh;
        }
      }

      svg#infoButton {
        aspect-ratio: 1;
        width: 80%;
        grid-area: informationIcon;
        font-size: 70px;
        dominant-baseline: middle;
        text-anchor: middle;
        font-family: 'Georgia';
      }

      #gameIcon {
        grid-area: gameIcon;
        height: 85%;
        width: 85%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #hourGlassIcon {
        grid-area: hourGlassIcon;
        height: 85%;
        width: 85%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      dialog#description {
        margin: 0;
        inset: auto;
        max-width: 100px;
        width: max-context;
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
    `;
  }

  handleClickInfo(evt: Event) {
    evt.stopPropagation();

    if (this.descriptionRef.value && this.iButtonRef.value) {
      // We first need to show the dialog, as otherwise computePosition doesn't work
      this.descriptionRef.value.showPopover();

      computePosition(this.iButtonRef.value, this.descriptionRef.value, {
        placement: 'top',
        middleware: [offset(4), flip(), shift({ padding: 5 })],
      })
        .then(({ x, y }) => {
          if (this.descriptionRef.value && this.iButtonRef.value) {
            this.descriptionRef.value.style.left = `${x}px`;
            this.descriptionRef.value.style.top = `${y}px`;
          }
        })
        .catch(() => {
          // An error occured in the compute Position, we simply don't change the coordinates, the description will appear on the middle of the viewport.
          console.error(`computePosition failed - description not shown`);
        });
    }
  }

  handleDescriptionToggle(/*evt: ToggleEvent*/) {
    // console.log(`toggle event`);
    // console.log(evt);
  }

  handleClickMain() {
    // console.log(`main click`);
  }

  render(): HTMLTemplateResult {
    return html`
      <div id="gameButton" @click=${() => this.handleClickMain()}>
        <div id="gameIcon"><slot></slot></div>
        <div id="hourGlassIcon" class="timeCodeA"></div>
        <svg
          viewBox="-50 -50 100 100"
          id="infoButton"
          @click=${(evt: Event) => this.handleClickInfo(evt)}
          ${ref(this.iButtonRef)}
        >
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
      </div>
      <dialog id="description" popover ${ref(this.descriptionRef)}>
        ${this.description}
      </dialog>
    `;
  }
}
