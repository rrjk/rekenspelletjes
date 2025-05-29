import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

// eslint-disable-next-line no-unused-vars
import 'web-dialog';
import type { WebDialog } from 'web-dialog';

import { RKdialogStyles } from './RKDialog';

import { ChildNotFoundError } from './ChildNotFoundError';

export class MessageDialog extends LitElement {
  @property({ type: String })
  accessor dialogTitle: string;
  @property({ attribute: false })
  accessor text: HTMLTemplateResult;
  @property({ attribute: false })
  accessor imageUrl: URL;

  static get styles(): CSSResultGroup {
    return RKdialogStyles;
  }

  constructor() {
    super();
    this.text = html``;
    this.dialogTitle = '';
    this.imageUrl = new URL('../images/Mompitz Otto.png', import.meta.url);
  }

  /** Get the dialog child
   *  @throws {ChildNotFoundError} Child was not found, probably because the game over dialog was not rendered yet.
   */
  get _dialog(): WebDialog {
    const ret = <WebDialog | null>this.renderRoot.querySelector('#dialog');
    if (ret === null) {
      throw new ChildNotFoundError('dialog', 'MessageDialog');
    }
    return ret;
  }

  show(title: string, text: HTMLTemplateResult): Promise<string> {
    this.text = text;
    this.dialogTitle = title;
    return new Promise(resolve => {
      this._dialog.addEventListener(
        'close',
        e => {
          resolve((<CustomEvent<string>>e).detail);
        },
        { once: true },
      );
      this._dialog.show();
    });
  }

  handleOkButton(): void {
    this._dialog.close('Ok');
  }

  render(): HTMLTemplateResult {
    return html` <web-dialog id="dialog" center @closing="${(evt: Event) =>
      evt.preventDefault()}">
                    <header>
                        <h1>${this.dialogTitle}</h1>
                    </header>
                    <article>
                        <div>
                            ${this.text}
                        </div>
                        <img style="float: right; width: 200px; max-width: calc(25 * 1vmin); height: auto; " alt="Mompitz figuurtje" src="${
                          this.imageUrl
                        }"></img>
                    </article>
                    <footer>
                        <button style="float: right;" @click="${() =>
                          this.handleOkButton()}">Ok</button>
                    </footer>
                </web-dialog> `;
  }
}

customElements.define('message-dialog', MessageDialog);
