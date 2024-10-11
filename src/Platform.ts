/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { property } from 'lit/decorators.js';

import type { TemplateResult, CSSResultGroup } from 'lit';

export class Platform extends LitElement {
  @property({ type: Boolean })
  dragDisabled = false;
  @property({ type: Number })
  cummulativeDeltaX = 0;
  mouseDrag = false;
  touchDrag = false;
  touchPreviousScreenX = 0;
  @property({ type: Number })
  maxDeltaX = 0;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        transform: translate(var(--cummulativeDeltaX, 0), 0);
      }
    `;
  }

  /* Determine the width of the custom-element. expressed in vw units.
   * By using vw units, the dimensions that are based on the width of
   * the custom-element nicely scale when the window size is changed.
   */
  get width(): number {
    const widthInPixels = this.getBoundingClientRect().width;
    const viewPortWidthInPixels = window.innerWidth;
    const widthInVw = (widthInPixels / viewPortWidthInPixels) * 100;
    return widthInVw;
  }

  /* Determine the height of the custom-element. expressed in vw units.
   * By using vw units, the dimensions that are based on the width of
   * the custom-element nicely scale when the window size is changed.
   */
  get height(): number {
    const heightInPixels = this.getBoundingClientRect().height;
    const viewPortHeightInPixels = window.innerHeight;
    const heightInVh = (heightInPixels / viewPortHeightInPixels) * 100;
    return heightInVh;
  }

  mouseDown(): void {
    if (!this.dragDisabled) this.mouseDrag = true;
  }

  touchStart(evt: TouchEvent): void {
    if (!this.dragDisabled) this.touchDrag = true;
    this.touchPreviousScreenX = evt.changedTouches[0].screenX;
  }

  mouseMove(evt: MouseEvent): void {
    if (this.mouseDrag) {
      this.cummulativeDeltaX += (evt.movementX / window.innerWidth) * 100;
      if (this.cummulativeDeltaX > this.maxDeltaX)
        this.cummulativeDeltaX = this.maxDeltaX;
      else if (this.cummulativeDeltaX < 0) this.cummulativeDeltaX = 0;
      //      this.style.transform = `translate(${this.cummulativeDeltaX}vw, 0px)`;
      this.style.setProperty(
        '--cummulativeDeltaX',
        `${this.cummulativeDeltaX}vw`
      );
    }
  }

  touchMove(evt: TouchEvent): void {
    if (this.touchDrag) {
      this.cummulativeDeltaX +=
        ((evt.changedTouches[0].screenX - this.touchPreviousScreenX) /
          window.innerWidth) *
        100;
      this.touchPreviousScreenX = evt.changedTouches[0].screenX;
      if (this.cummulativeDeltaX > this.maxDeltaX)
        this.cummulativeDeltaX = this.maxDeltaX;
      else if (this.cummulativeDeltaX < 0) this.cummulativeDeltaX = 0;
      this.style.setProperty(
        '--cummulativeDeltaX',
        `${this.cummulativeDeltaX}vw`
      );
      //    this.style.transform = `translate(${this.cummulativeDeltaX}vw, 0px)`;
    }
  }

  mouseUp(): void {
    this.mouseDrag = false;
  }

  touchEnd(): void {
    this.touchDrag = false;
  }

  async firstUpdated(): Promise<void> {
    await this.updateComplete;
    this.addEventListener('mousedown', () => this.mouseDown()); // Construction with => used to ensure this is set properly.
    this.addEventListener('touchstart', evt => this.touchStart(evt));
    window.addEventListener('mousemove', evt => this.mouseMove(evt));
    window.addEventListener('touchmove', evt => this.touchMove(evt));
    window.addEventListener('mouseup', () => this.mouseUp());
    window.addEventListener('touchend', () => this.touchEnd());
  }

  /** Render the photoframe
   * @return Template for the photoframe, including attaching line.
   */
  render(): TemplateResult {
    return html`
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style="width: 100%; height: 100%; display: block;"
      >
        <!--  -->
        <g>
          <!--
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="grey"
            fill-opacity="25%"
          ></rect>
  -->
          <line x1="0" y1="0" x2="100" y2="0" stroke="red" stroke-width="5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="red" stroke-width="5" />
        </g>
      </svg>
    `;
  }
}

customElements.define('numberline-platform', Platform);
