import { LitElement, html } from 'lit';
// eslint-disable-next-line no-unused-vars
import { WebDialog } from 'web-dialog';

import { RKdialogStyles } from './RKDialog';

export class MessageDialog extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      text: { type: String },
    };
  }

  static get styles() {
    return RKdialogStyles; // By default a button has a font-size that is not equal to 1em, but some fixed number. As I need it to be responsive, I set it to 1em.
  }

  constructor() {
    super();
    this.promiseResolve = null;
    this.promiseReject = null;
    this.text = html``;
    this.title = html``;
  }

  show(title, text) {
    this.text = text;
    this.title = title;
    /** @type WebDialog */
    const dialog = this.shadowRoot.getElementById('dialog');
    return new Promise((resolve, reject) => {
      this.promiseReject = reject;
      this.promiseResolve = resolve;
      dialog.show();
    });
  }

  handleOkButton() {
    /** @type WebDialog */
    const dialog = this.shadowRoot.getElementById('dialog');
    dialog.close();
    if (this.promiseResolve !== null) this.promiseResolve();
    this.promiseResolve = null;
    this.promiseReject = null;
  }

  render() {
    return html` <web-dialog id="dialog" center @closing="${event =>
      event.preventDefault()}">
                    <header>
                        <h1>${this.title}</h1>
                    </header>
                    <article>
                        <div>
                            ${this.text}
                        </div>
                        <img style="float: right; width: 200px; max-width: calc(25 * 1vmin); height: auto; " alt="Anne" src="images/Mompitz Otto.png"></img>
                    </article>
                    <footer>
                        <button style="float: right;" @click="${() =>
                          this.handleOkButton()}">Ok</button>
                    </footer>
                </web-dialog> `;
  }
}

customElements.define('message-dialog', MessageDialog);
