import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HTMLTemplateResult } from 'lit';

import './AscendingBalloons';
import type { AscendingBalloons, Answers } from './AscendingBalloons';

import { ChildNotFoundError } from './ChildNotFoundError';

@customElement('ascending-balloons-test-app')
export class AscendingBalloonsTestApp extends LitElement {
  @state()
  accessor disabled = true;
  @state()
  accessor answers = { correct: 13, incorrect: [67, 45, 3] } as Answers;

  /** Helper function to easily query for an element.
   *  @param query Querystring for the element.
   *  @template T The type of the element.
   *  @throws ChildNotFoundError in case the element can't be found.
   *
   */
  private getElement<T>(query: string): T {
    const ret = this.renderRoot.querySelector(query) as T | null;
    if (ret === null) {
      throw new ChildNotFoundError(query, 'FindOnNumberApp');
    }
    return ret;
  }

  private get ascendingBalloons(): AscendingBalloons {
    return this.getElement<AscendingBalloons>('ascending-balloons');
  }

  /** Toggle disabled flag */
  toggleDisabled() {
    this.disabled = !this.disabled;
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      <ascending-balloons
        style="position: absolute; height: 100%; width:100%; border: 1px black solid"
        @correct-balloon-clicked=${() =>
          this.ascendingBalloons.restartAscension()}
        @wrong-balloon-clicked=${() => {
          const logBox = this.getElement<HTMLParagraphElement>('#logBox');
          logBox.insertAdjacentText('beforeend', 'Wrong balloon clicked == ');
        }}
        @ascension-complete=${() => {
          const logBox = this.getElement<HTMLParagraphElement>('#logBox');
          logBox.insertAdjacentText(
            'beforeend',
            'Ascension complete event received == ',
          );
        }}
        .answers=${this.answers}
        ?disabled=${this.disabled}
      ></ascending-balloons>

      <button
        style="position:absolute; left: 0; top:0;"
        id="ascendButton"
        @click=${() => {
          this.ascendingBalloons.startAscension();
        }}
      >
        Ascend
      </button>

      <button
        style="position:absolute; left: 0; top:50px;"
        id="resetButton"
        @click=${() => {
          this.ascendingBalloons.reset();
        }}
      >
        Reset
      </button>

      <button
        style="position:absolute; left: 0; top:75px;"
        id="toggleDisabledButton"
        @click=${() => this.toggleDisabled()}
      >
        Toggle disabled
      </button>
      <p id="logBox"></p>
    `;
  }
}
