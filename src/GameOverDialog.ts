import { LitElement, html } from 'lit';
// eslint-disable-next-line import/extensions
import { state } from 'lit/decorators.js';

import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import 'web-dialog';
import type { WebDialog } from 'web-dialog';

import { RKdialogStyles } from './RKDialog';

import { ChildNotFoundError } from './ChildNotFoundError';

/** Game over dialog */
export class GameOverDialog extends LitElement {
  static gameOverImage = new URL('../images/Mompitz Anne.png', import.meta.url);

  @state()
  accessor text: HTMLTemplateResult;

  static get styles(): CSSResultGroup {
    return RKdialogStyles;
  }

  constructor() {
    super();
    this.text = html``;
  }

  /** Get the dialog child
   *  @throws {ChildNotFoundError} Child was not found, probably because the game over dialog was not rendered yet.
   */
  get _dialog(): WebDialog {
    const ret = <WebDialog | null>this.renderRoot.querySelector('#dialog');
    if (ret === null) {
      throw new ChildNotFoundError('dialog', 'GameOverDialog');
    }
    return ret;
  }

  show(text: HTMLTemplateResult): Promise<string> {
    this.text = text;
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

  handleAgainButton(): void {
    this._dialog.close('again');
  }

  handleBackToMenuButton(): void {
    this._dialog.close('stop');
  }

  /** Render the dialog */
  render(): HTMLTemplateResult {
    return html` <web-dialog id="dialog" center @closing="${(evt: Event) =>
      evt.preventDefault()}">
                    <header>
                        <h1>Game over</h1>
                    </header>
                    <article>
                        <div>
                            ${this.text}
                        </div>
                        <img style="float: right; width: 200px; max-width: calc(25 * 1vmin); height: auto; " alt="Anne" src="${
                          GameOverDialog.gameOverImage
                        }"></img>
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
