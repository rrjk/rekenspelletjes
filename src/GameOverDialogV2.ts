/* eslint-disable max-classes-per-file -- Event class defined for closed event */
import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { CSSResultGroup, HTMLTemplateResult } from 'lit';
import { getColorInfo } from './Colors';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

type Action = 'NewGame' | 'PlayAgain';

export class GameOverDialogCloseEvent extends Event {
  action: Action;
  constructor(action: Action) {
    super('close');
    this.action = action;
  }
}

@customElement('game-over-dialog-v2')
export class GameOverDialogV2 extends LitElement {
  /** Image to use in the dialog, if none is specified, Mompitz Anne is used. */
  @property({ attribute: false })
  accessor imageUrl = new URL('../images/Mompitz Anne.png', import.meta.url);

  /** Should the  dialog box start open*/
  @property({ type: Boolean })
  accessor initialOpen = false;

  @property({ type: Number })
  accessor nmbrCorrect: number | undefined = undefined;

  @property({ type: Number })
  accessor nmbrInCorrect: number | undefined = undefined;

  @property({ type: Number })
  accessor playTime: number | undefined = undefined;

  /** Reference to the dialog HTML element used. */
  dialogRef: Ref<HTMLDialogElement> = createRef();

  static get styles(): CSSResultGroup {
    return css`
      :host {
        font-family: Arial, Helvetica, sans-serif;
        font-size: min(100%, 3.5vh, 3vw);
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
          'button button';
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

      div#buttons {
        grid-area: button;
        justify-self: start;
      }

      button {
        background-color: ${unsafeCSS(getColorInfo('red').mainColorCode)};
        color: white;
        font-size: 100%;
        border: none;
        padding-top: 0.3em;
        padding-bottom: 0.3em;
        padding-left: 0.6em;
        padding-right: 0.6em;
        box-sizing: content-box;
        border-radius: 999px;
        display: inline-block;
        margin: 0.2em;
      }

      button:focus {
        outline: none; /* Prevent browser from adding some kind of outline to a focussed button */
        border: 2px solid ${unsafeCSS(getColorInfo('red').accentColorCode)};
      }

      /* Inside the dialog we have a small table to show the results of the game.
         The first column holds the name of the results and needs to be bold
         The second column holds the results, a number, which is right aligned
         The third column holds, only for the play time, the number of seconds and the unit
         as we don't want space between the number of minutes and the semicolon in front of the
         number of seconds, we remove all right padding from column 2 and all left padding from
         column 3
      */
      tbody tr td:nth-child(1) {
        font-weight: bold;
      }

      tbody tr td:nth-child(2) {
        text-align: right;
        padding-right: 0;
      }

      tbody tr td:nth-child(3) {
        padding-left: 0;
      }
    `;
  }

  renderPlayTimeRow() {
    if (!this.playTime) return nothing;

    let column3: HTMLTemplateResult | typeof nothing = nothing;

    if (this.playTime && this.playTime % 60 !== 0)
      column3 = html`<td>
        :${(this.playTime % 60).toString().padStart(2, '0')} minuten
      </td>`;
    else if (this.playTime !== 60) column3 = html`<td>&nbsp;minuten</td>`;
    else column3 = html`<td>&nbsp;minuut</td>`;

    return html` <tr>
      <td>Tijd gespeeld:</td>
      <td class="number">${Math.floor(this.playTime / 60)}</td>
      ${column3}
    </tr>`;
  }

  renderNmbrCorrectRow() {
    if (this.nmbrCorrect)
      return html`
        <tr>
          <td>Aantal goed:</td>
          <td class="number">${this.nmbrCorrect}</td>
          <td></td>
        </tr>
      `;
  }

  renderNmbrInCorrectRow() {
    if (this.nmbrCorrect)
      return html`
        <tr>
          <td>Aantal fout:</td>
          <td class="number">${this.nmbrInCorrect}</td>
          <td></td>
        </tr>
      `;
  }

  renderScoreRow() {
    if (this.nmbrCorrect && this.nmbrInCorrect)
      return html`
        <tr>
          <td>Score:</td>
          <td class="number">${this.nmbrCorrect - this.nmbrInCorrect}</td>
          <td></td>
        </tr>
      `;
  }

  render() {
    return html`
      <!-- We treat cancelling the dialog the same as clicking the new game button -->
      <dialog ${ref(this.dialogRef)} @cancel=${() => this.handleClickNewGame()}>
        <div id="dialogContent">
          <div id="title">Game over</div>
          <div id="textContent">
            <slot></slot>
            <table>
              <tbody>
                ${this.renderPlayTimeRow()} ${this.renderNmbrCorrectRow()}
                ${this.renderNmbrInCorrectRow()} ${this.renderScoreRow()}
              </tbody>
            </table>
          </div>
          <div id="image">
            <img alt="Mompitz figuurtje" src=${this.imageUrl} />
          </div>
          <div id="buttons">
            <button
              autofocus
              id="NewGameButton"
              @click=${() => this.handleClickNewGame()}
            >
              Nieuw spel kiezen
            </button>
            <button
              id="PlayAgainButton"
              @click=${() => this.handleClickPlayAgain()}
            >
              Speel nog een keer
            </button>
          </div>
        </div>
      </dialog>
    `;
  }

  protected firstUpdated(): void {
    if (this.initialOpen) this.showModal();
  }

  showModal() {
    if (this.dialogRef.value) this.dialogRef.value.showModal();
    else
      throw new Error(
        'GameOverDialogV2.showModal called, but dialog is not yet rendered',
      );
  }

  handleClickNewGame() {
    if (this.dialogRef.value) this.dialogRef.value.close();
    const event = new GameOverDialogCloseEvent('NewGame');
    this.dispatchEvent(event);
  }

  handleClickPlayAgain() {
    if (this.dialogRef.value) this.dialogRef.value.close();
    const event = new GameOverDialogCloseEvent('PlayAgain');
    this.dispatchEvent(event);
  }
}
