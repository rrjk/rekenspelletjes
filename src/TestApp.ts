import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, state } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

import type { PuzzlePhoto } from './PuzzlePhoto';
import './PuzzlePhoto';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor numberVisiblePieces = 5;

  puzzlePhotoRef: Ref<PuzzlePhoto> = createRef();

  get maxPieces() {
    if (this.puzzlePhotoRef.value === undefined) return 0;
    return this.puzzlePhotoRef.value.numberPieces;
  }

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

  minus(): void {
    if (this.numberVisiblePieces > 0) this.numberVisiblePieces -= 1;
  }

  plus(): void {
    if (
      this.puzzlePhotoRef.value !== undefined &&
      this.numberVisiblePieces < this.puzzlePhotoRef.value.numberPieces
    )
      this.numberVisiblePieces += 1;
  }

  protected renderTest(): HTMLTemplateResult {
    return html`<puzzle-photo
        ${ref(this.puzzlePhotoRef)}
        numberVisiblePieces=${this.numberVisiblePieces}
      ></puzzle-photo>
      <button
        ?disabled=${this.numberVisiblePieces === 0}
        @click=${() => this.minus()}
      >
        minus
      </button>
      <button
        ?disabled=${this.numberVisiblePieces === this.maxPieces}
        @click=${() => this.plus()}
      >
        plus
      </button> `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
