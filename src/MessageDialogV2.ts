import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { CSSResultGroup } from 'lit';
import { getColorInfo } from './Colors';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

@customElement('message-dialog-v2')
export class MessageDialogV2 extends LitElement {
  /** Title of the message dialog */
  @property({ type: String })
  accessor title = 'Dialog Title';

  /** Image to use in the dialog, if none is specified, Mompitz Otto is used. */
  @property({ attribute: false })
  accessor imageUrl = new URL('../images/Mompitz Otto.png', import.meta.url);

  /** Should the  dialog box start open*/
  @property({ type: Boolean })
  accessor initialOpen = false;

  /** Reference to the dialog HTML element used. */
  dialogRef: Ref<HTMLDialogElement> = createRef();

  static get styles(): CSSResultGroup {
    return css`
      :host {
        font-family: Arial, Helvetica, sans-serif;
        font-size: min(100%, 3.5vh, 3.5vw);
        display: inline; /*To ensure we don't set a size for the host */
      }

      dialog {
        max-width: 500px;
        width: 70%;
        border-radius: 13px;
        border: none;
      }

      dialog::backdrop {
        background: rgba(0, 0, 0, 0.7);
      }

      div#dialogContent {
        background: #ffffff;
        display: grid;
        grid-template-columns: 6fr 4fr;
        grid-template-rows: auto;
        grid-template-areas:
          'title title'
          'text image'
          'button .';
      }

      div#title {
        grid-area: title;
        font-size: 135%;
        font-weight: bold;
        margin: 0.2em;
      }

      div#textContent {
        grid-area: text;
        max-height: 50vh;
        overflow-y: auto;
        margin: 0.2em;
      }

      div#image {
        grid-area: image;
        display: flex;
        justify-content: center;
        width: 100%;
        max-height: 50vh;
        margin: 0.2em;
      }

      img {
        object-fit: contain;
        max-width: 100%;
        max-height: 50vh;
      }

      button#okButton {
        grid-area: button;
        justify-self: start;
        background-color: ${unsafeCSS(getColorInfo('red').mainColorCode)};
        color: white;
        width: 5em;
        height: 2em;
        font-size: 100%;
        border: none;
        border-radius: 999px;
        display: inline-block;
        margin: 0.2em;
      }

      button#okButton:focus {
        outline: none;
        border: 2px solid ${unsafeCSS(getColorInfo('red').accentColorCode)};
      }
    `;
  }

  render() {
    return html`
      <dialog ${ref(this.dialogRef)} @close=${() => this.handleCloseDialog()}>
        <div id="dialogContent">
          <div id="title">${this.title}</div>
          <div id="textContent">
            <slot></slot>
          </div>
          <div id="image">
            <img alt="Mompitz figuurtje" src=${this.imageUrl} />
          </div>
          <button id="okButton" @click=${() => this.handleClick()}>Ok</button>
        </div>
      </dialog>
    `;
  }

  protected firstUpdated(): void {
    if (this.initialOpen) this.showModal();
  }

  showModal() {
    if (this.dialogRef.value) this.dialogRef.value.showModal();
    else throw new Error('showModal called, but dialog is not yet rendered');
  }

  handleCloseDialog() {
    const event = new Event('close');
    this.dispatchEvent(event);
  }

  handleClick() {
    if (this.dialogRef.value) this.dialogRef.value.close();
  }
}
