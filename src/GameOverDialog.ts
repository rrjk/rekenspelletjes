import { LitElement, html } from 'lit';
import type {
  PropertyDeclarations,
  CSSResultGroup,
  HTMLTemplateResult,
} from 'lit';

import 'web-dialog';
import type { WebDialog } from 'web-dialog';

import { RKdialogStyles } from './RKDialog';

/** Game over dialog */
export class GameOverDialog extends LitElement {
  text: HTMLTemplateResult;

  static get properties(): PropertyDeclarations {
    return {
      text: { state: true, attribute: false },
    };
  }

  static get styles(): CSSResultGroup {
    return RKdialogStyles;
  }

  constructor() {
    super();
    this.text = html``;
  }

  show(text: HTMLTemplateResult): Promise<string> {
    this.text = text;
    const dialog = <WebDialog>this.shadowRoot.getElementById('dialog');
    return new Promise(resolve => {
      dialog.addEventListener(
        'close',
        e => {
          resolve((<CustomEvent<string>>e).detail);
        },
        { once: true }
      );
      dialog.show();
    });
  }

  handleAgainButton(): void {
    const dialog = <WebDialog>this.shadowRoot.getElementById('dialog');
    dialog.close('again');
  }

  handleBackToMenuButton(): void {
    const dialog = <WebDialog>this.shadowRoot.getElementById('dialog');
    dialog.close('stop');
  }

  /** Render the dialog */
  render(): HTMLTemplateResult {
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
