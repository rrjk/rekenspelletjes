import { LitElement, html } from 'lit';
// eslint-disable-next-line no-unused-vars
import { WebDialog } from 'web-dialog';

import { RKdialogStyles } from './RKDialog';

/** Game over dialog */
export class GameOverDialog extends LitElement {
  static get properties() {
    return {
      text: { type: String },
    };
  }

  static get styles() {
    return RKdialogStyles; // By default a button has a font-size that is not equal to 1em, but some fixed number. As I need it to be responsive, I set it to 1em.
  }

  constructor() {
    super();
    /** Variable to hold the promise resolve function, will be set when the dialog is shown and used in the button press handlers. */
    this.promiseResolve = null;
    /** Variable to hold the promise reject function, will be set when the dialog is shown and used in the button press handlers. */
    this.promiseReject = null;
    /** Property for the text to show in the dialog */
    this.text = html``;
  }

  show(text) {
    this.text = text;
    /** @type WebDialog */
    const dialog = this.shadowRoot.getElementById('dialog');
    return new Promise((resolve, reject) => {
      this.promiseReject = reject;
      this.promiseResolve = resolve;
      dialog.show();
    });
  }

  handleAgainButton() {
    /** @type WebDialog */
    const dialog = this.shadowRoot.getElementById('dialog');
    dialog.close();
    if (this.promiseResolve !== null) this.promiseResolve('again');
    this.promiseResolve = null;
    this.promiseReject = null;
  }

  handleBackToMenuButton() {
    /** @type WebDialog */
    const dialog = this.shadowRoot.getElementById('dialog');
    dialog.close();
    if (this.promiseResolve !== null) this.promiseResolve('stop');
    this.promiseResolve = null;
    this.promiseReject = null;
  }

  /** Render the dialog */
  render() {
    return html` <web-dialog id="dialog" center @closing="${event =>
      event.preventDefault()}">
                    <header>
                        <h1>Game over</h1>
                    </header>
                    <article>
                        <div>
                            ${this.text}
                        </div>
                        <img style="float: right; width: 200px; max-width: calc(25 * 1vmin); height: auto; " alt="Anne" src="images/Mompitz Anne.png"></img>
                    </article>
                    <footer>
                        <button style="float: right;" @click="${() =>
                          this.handleAgainButton()}">Speel nog een keer</button>
                        <span style="float: right;">&nbsp;</span>
                        <button style="float: right;" @click="${() =>
                          this.handleBackToMenuButton()}">Nieuw spel kiezen</button>
                    </footer>
                </web-dialog> `;
  }
}

customElements.define('gameover-dialog', GameOverDialog);
