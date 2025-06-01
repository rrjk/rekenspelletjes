import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { ChildNotFoundError } from './ChildNotFoundError';

/** Progressbar element
 * This is a bar taking the full width counting down time.
 *
 * @cssprop --progress-bar-gametime - How long should the progress bar run (e.g. 120s), default is 60s
 */
@customElement('progress-bar')
export class ProgressBar extends LitElement {
  @property({ type: Number })
  accessor numberOk = 0;
  @property({ type: Number })
  accessor numberNok = 0;
  @property({ type: Boolean })
  accessor integrateScoreBox = false;

  static height = 20;

  static get styles(): CSSResultGroup {
    return css`
      .GreenText {
        color: green;
      }

      .RedText {
        color: red;
      }

      #ProgressBarOutline {
        margin: 0;
        padding: 0;
        width: 100%;
        height: ${ProgressBar.height}px;
        border-style: none;
        background-color: lightgrey;
        text-align: right;
      }

      #ProgressBar {
        background-color: aquamarine;
        transform-origin: left;
        height: 100%;
        border-style: none;
      }

      #ScoreBox {
        position: absolute;
        top: 0;
        right: 0;
        margin-right: 1em;
        margin-top: auto;
        margin-bottom: auto;
      }

      .TransitionToZeroWidth {
        animation: MakeZeroWidth linear var(--progress-bar-gametime, 60s);
        animation-fill-mode: forwards;
      }

      @keyframes MakeZeroWidth {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }

      @keyframes MakeFullWidth {
        from {
          transform: scaleX(0);
        }
        to {
          transform: scaleX(1);
        }
      }
    `;
  }

  /*
  constructor() {
    super();
  }
*/

  firstUpdated(): void {
    this._progressBar.addEventListener('animationend', () => this.timeUp());
  }

  /*  
  connectedCallback() {
    super.connectedCallback()  
    this.progressBar.addEventListener('animationend', () => this.timeUp());
  }
  
  disconnectedCallback() {
    super.disconnectedCallback()  
    this.progressBar.removeEventListener('animationend', () => this.timeUp());
  }
*/

  /** Get the progress bar child
   *  @throws {ChildNotFoundError} Child was not found, probably because the progress bar was not rendered yet.
   */
  get _progressBar(): HTMLElement {
    const ret = this.renderRoot.querySelector<HTMLElement>('#ProgressBar');
    if (ret === null) {
      throw new ChildNotFoundError('ProgressBar', 'ProgressBar');
    }
    return ret;
  }

  restart(): void {
    this._progressBar.classList.remove('TransitionToZeroWidth');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dummy = this._progressBar.offsetWidth; // This is a dummy command to force a reflow such that the transition is reset.
    this._progressBar.classList.add('TransitionToZeroWidth');
  }

  timeUp(): void {
    const event = new CustomEvent('timeUp', {
      detail: { message: "time's up" },
    });
    this.dispatchEvent(event);
  }

  render(): HTMLTemplateResult {
    return html`<div id="ProgressBarOutline">
      <div id="ProgressBar"></div>
      ${this.integrateScoreBox
        ? html` <div id="ScoreBox">
            <span class="GreenText">✓</span> : ${this.numberOk}
            <span class="RedText">✗</span> : ${this.numberNok}
          </div>`
        : ''}
    </div>`;
  }
}
