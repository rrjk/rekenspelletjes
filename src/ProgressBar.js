import { LitElement, html, css } from 'lit';

/**
 * CCS custome properties:
 *   - --progress-bar-gameTime: How long should the progress bar run (e.g. 120s), default is 60s
 */

export class ProgressBar extends LitElement {
  static get properties() {
    return {};
  }

  static get styles() {
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

  firstUpdated() {
    this.progressBar = this.shadowRoot.getElementById('ProgressBar');
    this.progressBar.addEventListener('animationend', () => this.timeUp());
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
  get _progressBar() {
    return this.shadowRoot.querySelector('#ProgressBar');
  }

  restart() {
    this._progressBar.classList.remove('TransitionToZeroWidth');
    // eslint-disable-next-line no-unused-vars
    const dummy = this._progressBar.offsetWidth; // This is a dummy command to force a reflow such that the transition is reset.
    this._progressBar.classList.add('TransitionToZeroWidth');
  }

  timeUp() {
    const event = new CustomEvent('timeUp', {
      detail: { message: "time's up" },
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`<div id="ProgressBarOutline">
      <div id="ProgressBar">&nbsp;</div>
    </div>`;
  }
}

customElements.define('progress-bar', ProgressBar);
