import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import { Draggable } from './DragAndDropCoordinator';

@customElement('draggable-element')
export class DraggableElement extends LitElement implements Draggable {
  @state()
  private cummulativeDeltaX = 0;
  @state()
  private cummulativeDeltaY = 0;

  maxDeltaX = 0;
  minDeltaX = 0;
  maxDeltaY = 0;
  minDeltaY = 0;

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    return result;
  }

  resetDrag() {
    this.cummulativeDeltaX = 0;
    this.cummulativeDeltaY = 0;
  }

  drag(deltaX: number, deltaY: number): void {
    const rectDraggable = this.getBoundingClientRect();
    this.minDeltaX = -rectDraggable.left;
    this.maxDeltaX = window.innerWidth - rectDraggable.right;
    this.minDeltaY = -rectDraggable.top;
    this.maxDeltaY = window.innerHeight - rectDraggable.bottom;

    if (deltaX < this.minDeltaX) this.cummulativeDeltaX += this.minDeltaX;
    else if (deltaX > this.maxDeltaX) this.cummulativeDeltaX += this.maxDeltaX;
    else this.cummulativeDeltaX += deltaX;

    if (deltaY < this.minDeltaY) this.cummulativeDeltaY += this.minDeltaY;
    else if (deltaY > this.maxDeltaY) this.cummulativeDeltaY += this.maxDeltaY;
    else this.cummulativeDeltaY += deltaY;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block-inline;
        transform: translate(
          var(--cummulativeDeltaX, 0),
          var(--cummulativeDeltaY, 0)
        );
      }
    `;
  }

  render(): HTMLTemplateResult {
    return html` <style>
        :host {
          --cummulativeDeltaX: ${this.cummulativeDeltaX}px;
          --cummulativeDeltaY: ${this.cummulativeDeltaY}px;
        }
      </style>
      <slot> </slot>`;
  }
}
