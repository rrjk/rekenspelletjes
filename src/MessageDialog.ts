import { LitElement, html } from 'lit';

import type {
  PropertyDeclarations,
  CSSResultGroup,
  HTMLTemplateResult,
} from 'lit';

// eslint-disable-next-line no-unused-vars
import 'web-dialog';
import type { WebDialog } from 'web-dialog';

import { RKdialogStyles } from './RKDialog';


export class MessageDialog extends LitElement {

  dialogTitle: string;
  text: string;

  static get properties(): PropertyDeclarations {
    return {
      dialogTitle: { type: String },
      text: { type: String },
    };
  }

  static get styles(): CSSResultGroup {
    return RKdialogStyles; 
  }

  constructor() {
    super();
    this.text = ``;
    this.dialogTitle = ``;
  }

  show(title: string, text:string):Promise<string> {
    this.text = text;
    this.dialogTitle = title;
    console.log(this._dialog);
    return new Promise((resolve) => {
      this._dialog.addEventListener("close", (e) => {resolve((<CustomEvent<string>>e).detail);}, {once:true});
      this._dialog.show();
    });
  }

  handleOkButton():void {
    this._dialog.close('Ok');
  }

  get _dialog(): WebDialog{
    return <WebDialog>this.shadowRoot.getElementById('dialog');
  }

  render():HTMLTemplateResult {
    return html` <web-dialog id="dialog" center @closing="${event =>
      event.preventDefault()}">
                    <header>
                        <h1>${this.dialogTitle}</h1>
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

