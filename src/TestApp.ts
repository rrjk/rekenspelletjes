import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import { createRef, Ref } from 'lit/directives/ref.js';

import { PuzzlePhotoFrame } from './PuzzlePhotoFrame';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor numberVisiblePieces = 20;

  puzzlePhotoRef: Ref<PuzzlePhotoFrame> = createRef();

  get maxPieces() {
    return PuzzlePhotoFrame.maxNmbrPieces;
  }

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          display: block;
        }
        puzzle-photo-frame {
          width: 480px;
          height: 400px;
        }
      `,
    ];
  }

  minus(): void {
    if (this.numberVisiblePieces > 0) this.numberVisiblePieces -= 1;
  }

  plus(): void {
    console.log(
      `plus - numberVisiblePieces = ${this.numberVisiblePieces} - maxPieces = ${this.maxPieces}`,
    );
    if (this.numberVisiblePieces < this.maxPieces)
      this.numberVisiblePieces += 1;
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <puzzle-photo-frame
        numberVisiblePieces=${this.numberVisiblePieces}
      ></puzzle-photo-frame>
      <button @click=${() => this.plus()}>Plus</button>
      <button @click=${() => this.minus()}>Min</button>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
