import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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

@customElement('icon-info-button')
export class IconInfoButton extends LitElement {
  @property()
  accessor description = '';

  /* The iButton reference is used to keep track of the information button event. Once the source property of
   * the ToggleEvent gets widescale support, we no longer need this reference and the button can
   * be obtained from the event.
   * See https://caniuse.com/mdn-api_toggleevent_source for more details on the support of the source property.
   */
  iButton: Ref<HTMLButtonElement> = createRef();

  descriptionDialogCleanup = () => {
    /* nothing */
  };

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      button#infoButton {
        display: block;
        aspect-ratio: 1;
        width: 100%;
        border: none;
        margin: 0;
        padding: 0;
        background-color: transparent;
      }

      svg {
        width: 100%;
        height: 100%;
        font-size: 70px;
        dominant-baseline: middle;
        text-anchor: middle;
        font-family: 'Georgia';
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

  render(): HTMLTemplateResult {
    return html`
      <button id="infoButton" popovertarget="description" ${ref(this.iButton)}>
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
