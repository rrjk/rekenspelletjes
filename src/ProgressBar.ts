import { LitElement, html, css } from 'lit';

import type {
  PropertyDeclarations,
  CSSResultGroup,
  HTMLTemplateResult,
} from 'lit';

import { ChildNotFoundError } from './ChildNotFoundError';

/**
 * CCS custome properties:
 *   - --progress-bar-gameTime: How long should the progress bar run (e.g. 120s), default is 60s
 */

export class ProgressBar extends LitElement {
  static get properties(): PropertyDeclarations {
    return {};
  }

  static get styles(): CSSResultGroup {
    return css`
      #ProgressBarOutline {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 20px;
        border-style: none;
        background-color: lightgrey;
      }

      #ProgressBar {
        background-color: aquamarine;
        transform-origin: left;
        height: 100%;
        border-style: none;
      }

      .TransitionToZeroWidth {
        animation: MakeZeroWidth linear var(--progress-bar-gameTime, 60s);
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
    const ret = <HTMLElement | null>(
      this.renderRoot.querySelector('#ProgressBar')
    );
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
      <div id="ProgressBar">&nbsp;</div>
    </div>`;
  }
}

customElements.define('progress-bar', ProgressBar);
