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
import { renderEditIcon } from '../EditIcon';

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
          height: calc(0.9 * var(--font-size, 1em));
          aspect-ratio: 1;
        }

        button {
          padding: 0;
          border: 0px;
          background-color: transparent;
        }

        input {
          font-size: var(--font-size, 1em);
          font-weight: var(--font-weight, normal);
        }
      `,
    ];
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
        <button @click=${() => this.onEditClick()}>${renderEditIcon()}</button>
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
