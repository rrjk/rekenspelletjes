/* eslint-disable max-classes-per-file */

import {
  css,
  CSSResultArray,
  html,
  HTMLTemplateResult,
  LitElement,
  PropertyValues,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

/** Custom element to show text on the page that can be edited
 * @cssprop [--font-size=1em] - Font size for the editable text
 * @cssprop [--font-weigt=normal] - Font weight for the editable text
 * @property value - Text to show
 */
@customElement('editable-text')
export abstract class EditableText extends LitElement {
  /** Text to show */
  @property({ type: String })
  accessor value = '';

  /** State variable to keep track of whether the text is being edited */
  @state()
  accessor editInProgress = false;

  /** State variable for the draft value
   * The draft value is communicated back to the parent upon edit completion.
   */
  @state()
  accessor draftValue = '';

  /** Reference to the input element in edit mode */
  inputRef: Ref<HTMLInputElement> = createRef();

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: flex;
          column-gap: 10px;
          font-size: var(--font-size, 1em);
          font-weight: var(--font-weight, normal);
        }

        svg {
          height: calc(0.8 * var(--font-size, 1em));
          aspect-ratio: 1;
        }

        button {
          padding: 0;
          border: 0px;
        }

        input {
          font-size: var(--font-size, 1em);
          font-weight: var(--font-weight, normal);
        }
      `,
    ];
  }

  renderEditIcon(): HTMLTemplateResult {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          rx="24"
          stroke="black"
          stroke-width="5"
        />
        <path d="M17 83 22 63 59 25 75 41 37 78Z" stroke="black" fill="black" />
        <path
          d="M64 20 67 17A5.66 5.66 90 0 1 83 33L80 36Z"
          stroke="black"
          fill="black"
        />
      </svg>
    `;
  }

  onEditClick() {
    this.editInProgress = true;
    this.draftValue = this.value;
  }

  onInput(e: InputEvent) {
    if (e.target instanceof HTMLInputElement) {
      this.draftValue = e.target.value;
    }
  }

  onBlur() {
    if (this.draftValue !== this.value) {
      this.dispatchEvent(new ValueChangedEvent(this.draftValue));
    }
    this.editInProgress = false;
  }

  onKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement) {
      if (e.key === 'Enter') {
        e.target.blur(); // triggers onCommitValue via @blur
      } else if (e.key === 'Escape') {
        this.editInProgress = false;
      }
    }
  }

  updated(changeProperties: PropertyValues<this>) {
    if (
      changeProperties.has('editInProgress') &&
      this.editInProgress === true
    ) {
      this.inputRef.value?.focus();
      this.inputRef.value?.select();
    }
  }

  render(): HTMLTemplateResult {
    if (!this.editInProgress) {
      return html`
        <span>${this.value}</span>
        <button @click=${() => this.onEditClick()}>
          ${this.renderEditIcon()}
        </button>
      `;
    } else {
      return html`
        <input
          ${ref(this.inputRef)}
          .value=${this.draftValue}
          @input=${(e: InputEvent) => this.onInput(e)}
          @blur=${() => this.onBlur()}
          @keydown=${(e: KeyboardEvent) => this.onKeydown(e)}
        />
      `;
    }
  }
}

export class ValueChangedEvent extends Event {
  value: string;
  constructor(value: string) {
    super('value-changed', { bubbles: true, composed: true });
    this.value = value;
  }
}
