import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { type TimeCode, hourGlassIcons, stringToTimeCode } from './TimeCodes';
import { classMap } from 'lit/directives/class-map.js';

@customElement('icon-hourglass-button-v2')
export class IconHourglassButton extends LitElement {
  /** What time to use for the hourglass */
  @property({ converter: stringToTimeCode })
  accessor timeCode: TimeCode = 'a';

  /** Which gameCode to link to  */
  @property()
  accessor gameCode = 'a';

  /** Description to show */
  @property()
  accessor description = '';

  @state()
  accessor touched = false;

  mouseDownTimeOut = 0;
  clickInProgress = false;

  handleMouseUpBound = this.handleMouseUp.bind(this);
  handleHoverStartBound = this.handleHoverStart.bind(this);
  handleHoverEndBound = this.handleHoverEnd.bind(this);

  static get styles(): CSSResultGroup {
    return css`
      :host {
        aspect-ratio: 2 /1;
        container-type: size;
        display: grid;
        justify-items: center;
        align-items: center;
      }

      a {
        text-decoration: none;
      }

      div#gameButton {
        aspect-ratio: 2 / 1;
        display: grid;
        background-color: lightgrey;
        border: 1px solid black;
        justify-items: center;
        align-items: center;
        grid-template-rows: 81% 19%;
        grid-template-columns: 57% 33% 10%;
        grid-template-areas:
          'gameIcon hourGlassIcon blank'
          'gameIcon hourGlassIcon informationIcon';
        box-sizing: border-box;
      }

      div#gameButton.touched {
        background-color: yellow;
      }

      @container (aspect-ratio < 2) {
        div#gameButton {
          width: 100cqw;
          border-radius: 8cqw;
        }
      }

      @container (aspect-ratio >= 2) {
        div#gameButton {
          height: 100cqh;
          border-radius: 8cqh;
        }
      }
      svg#infoButton {
        aspect-ratio: 1;
        width: 80%;
        grid-area: informationIcon;
        font-size: 80px;
        dominant-baseline: middle;
        text-anchor: middle;
        font-family: 'Georgia';
      }

      #gameIcon {
        grid-area: gameIcon;
        height: 85%;
        width: 85%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #hourGlassIcon {
        grid-area: hourGlassIcon;
        height: 85%;
        width: 85%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .timeCodeA {
        background-image: url(${unsafeCSS(hourGlassIcons.a.href)});
      }
      .timeCodeB {
        background-image: url(${unsafeCSS(hourGlassIcons.b.href)});
      }
      .timeCodeC {
        background-image: url(${unsafeCSS(hourGlassIcons.c.href)});
      }
    `;
  }
  /*
  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.handleHoverStartBound);
    this.addEventListener('mouseleave', this.handleHoverEndBound);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.handleHoverStartBound);
    this.removeEventListener('mouseleave', this.handleHoverEndBound);
  }
*/
  handleMouseDown(evt: Event) {
    //console.log(`mouseDown`);
    evt.preventDefault();
    this.clickInProgress = true;
    document.addEventListener('mouseup', this.handleMouseUpBound);
    document.addEventListener('touchend', this.handleMouseUpBound);
    this.mouseDownTimeOut = window.setTimeout(
      () => this.handleLongClick(),
      500,
    );
  }

  handleMouseUp() {
    //console.log(`mouseUp`);
    //console.log(this.mouseDownTimeOut);
    if (this.mouseDownTimeOut) {
      window.clearTimeout(this.mouseDownTimeOut);
      this.mouseDownTimeOut = 0;
      //console.log(`short click`);
    } // else if (this.clickInProgress) console.log(`long click over`);
    // else console.log(`mouse up but no click in progress`);
    this.clickInProgress = false;
    this.touched = false;
    document.removeEventListener('mouseup', this.handleMouseUpBound);
    document.removeEventListener('touchend', this.handleMouseUpBound);
  }

  handleLongClick() {
    // console.log(`long click`);
    this.touched = true;
    this.mouseDownTimeOut = 0;
  }

  handleHoverStart() {
    // console.log('hover start');
  }

  handleHoverEnd() {
    // console.log('hover end');
  }

  render(): HTMLTemplateResult {
    const clss = { touched: this.touched };
    return html`
      <div
        id="gameButton"
        class=${classMap(clss)}
        @mousedown=${(evt: Event) => this.handleMouseDown(evt)}
        @mouseenter=${() => this.handleHoverStart()}
        @mouseleave=${() => this.handleHoverEnd()}
      >
        <div id="gameIcon"><slot></slot></div>
        <div id="hourGlassIcon" class="timeCodeA"></div>
        <svg id="infoButton" viewBox="-50 -50 100 100">
          <circle
            cx="0"
            cy="0"
            r="45"
            fill="none"
            stroke="black"
            stroke-width="5px"
          />
          <text x="0" y="7">i</text>
        </svg>
      </div>
    `;
  }
}
