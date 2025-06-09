import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

import type {
  GameOverDialogCloseEvent,
  GameOverDialogV2,
} from './GameOverDialogV2';
import './GameOverDialogV2';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor dialogOpen = false;

  dialogRef: Ref<GameOverDialogV2> = createRef();

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          display: block;
        }
        div#im {
          height: 100px;
          width: 100px;
          background-color: green;
        }
        img {
          object-fit: contain;
          max-width: 100px;
          max-height: 100px;
        }
      `,
    ];
  }
  protected renderTest(): HTMLTemplateResult {
    return html` <button @click=${() => this.handleButtonClick()}>
        AppButton
      </button>
      <p>Test</p>
      <game-over-dialog-v2
        ${ref(this.dialogRef)}
        @close=${(evt: GameOverDialogCloseEvent) => this.handleOk(evt)}
        .imageUrl=${new URL('../images/Mompitz Anne.png', import.meta.url)}
        .nmbrCorrect=${5}
        .nmbrInCorrect=${15}
        .playTime=${180}
      >
        <p>Je hebt het test app spel gespeeld</p>
      </game-over-dialog-v2>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }

  handleButtonClick() {
    console.log(`App Button click`);
    if (this.dialogRef.value) this.dialogRef.value.showModal();
    this.dialogOpen = true;
  }

  handleOk(evt: GameOverDialogCloseEvent) {
    console.log(`Dialog closed with ${evt.action}`);
    this.dialogOpen = false;
  }
}
