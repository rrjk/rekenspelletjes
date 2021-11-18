/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import './AscendingBalloons';

import type { AscendingBalloons } from './AscendingBalloons';

@customElement('ascending-balloons-test-app')
export class AscendingBalloonsTestApp extends LitElement {
  /** Helper function to easily query for an element.
   *  @param query Querystring for the element.
   *  @template T The type of the element.
   *  @throws ChildNotFoundError in case the element can't be found.
   *
   */
  private getElement<T>(query: string): T {
    const ret = <T | null>this.renderRoot.querySelector(query);
    if (ret === null) {
      throw new ChildNotFoundError(query, 'FindOnNumberApp');
    }
    return ret;
  }

  private get ascendingBalloons(): AscendingBalloons {
    return this.getElement<AscendingBalloons>('ascending-balloons');
  }

  /** Actions performed after the first update is complete. */
  async firstUpdated(): Promise<void> {
    /** Trigger baloons to start */
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      <ascending-balloons
        style="position: absolute; height: 100%; width:100%; border: 1px black solid"
      ></ascending-balloons>

      <button
        style="position:absolute; left: 0; top:0;"
        id="ascendButton"
        @click="${() => {
          console.log('button pressed');
          this.ascendingBalloons.startAscension();
        }}"
      >
        Ascend
      </button>

      <button
        style="position:absolute; left: 0; top:50px;"
        id="resetButton"
        @click="${() => {
          console.log('button pressed');
          this.ascendingBalloons.reset();
        }}"
      >
        Reset
      </button>
    `;
  }
}
