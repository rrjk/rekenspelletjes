/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';
import type { PropertyDeclarations, TemplateResult, CSSResultGroup } from 'lit';

export class Platform extends LitElement {
  enabled = true;
  cummulativeDeltaX = 0;
  drag = false;
  maxDeltaX = 0;

  static get styles(): CSSResultGroup {
    return css`
      .hide {
        display: none;
      }
    `;
  }

  static get properties(): PropertyDeclarations {
    return {
      location: { type: Number },
      maxDeltaX: { type: Number }, // Maximum delta for the platform in vw units
    };
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
    this.drag = true;
  }

  mouseMove(evt: MouseEvent): void {
    if (this.drag) {
      this.cummulativeDeltaX += (evt.movementX / window.innerWidth) * 100;
      if (this.cummulativeDeltaX > this.maxDeltaX)
        this.cummulativeDeltaX = this.maxDeltaX;
      else if (this.cummulativeDeltaX < 0) this.cummulativeDeltaX = 0;
      this.style.transform = `translate(${this.cummulativeDeltaX}vw, 0px)`;
    }
  }

  mouseUp(): void {
    this.drag = false;
  }

  async firstUpdated(): Promise<void> {
    await this.updateComplete;
    this.addEventListener('mousedown', () => this.mouseDown()); // Construction with => used to ensure this is set properly.
    window.addEventListener('mousemove', evt => this.mouseMove(evt));
    window.addEventListener('mouseup', () => this.mouseUp());
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
