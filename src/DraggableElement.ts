/* eslint-disable max-classes-per-file */
import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import { getRealViewportHeight, getRealViewportWidth } from './RealHeight';

export type HighlightType = 'none' | 'droppable' | 'wrong';
export type DropType = 'dropOk' | 'dropWrong';

export interface DropTargetElement extends HTMLElement {
  highlightForDrop(newState: HighlightType): void;
  value?: string;
}

export class DropEvent extends Event {
  draggableId = '';
  draggableValue = '';
  dropTargetId = '';
  dropTargetValue = '';
  dropType: DropType = 'dropOk';

  constructor() {
    super('dropped');
  }
}

type DropTarget = {
  element: DropTargetElement;
  dropType: DropType;
  minDeltaX: number;
  maxDeltaX: number;
  minDeltaY: number;
  maxDeltaY: number;
};

/** Draggable-element
 * When a data-value is added as HTML attribute, this is reflected in the dropped event.
 * When a data-value is added as HTML attribute to the droptarget, this is also reflected in the dropped event.
 */
@customElement('draggable-element')
export class DraggableElement extends LitElement {
  @property({ type: Boolean })
  private resetDragAfterDrop = false;
  @property({ type: Number })
  private dropAreaPercentage = 20; // Area in the draggable element that needs to be over the drop target, measured as percentage of total width and height
  @state()
  private cummulativeDeltaX = 0; // expressed as percentage of the viewport width
  @state()
  private cummulativeDeltaY = 0; // expressed as percentage of the viewport height

  @property({ type: String })
  value = '';

  @state()
  protected content = html`<slot> </slot>`; // Content of the draggeble element, default a slot but can be overruled in derived classes

  private dragActive = false;
  private touchPreviousScreenX = 0;
  private touchPreviousScreenY = 0;

  private maxCummulativeDeltaX = 0; // expressed as percentage of the viewport width
  private minCummlativeDeltaX = 0; // expressed as percentage of the viewport width
  private maxCummalativeDeltaY = 0; // expressed as percentage of the viewport height
  private minCummalativeDeltaY = 0; // expressed as percentage of the viewport height

  private dropTargets: DropTarget[] = [];

  constructor() {
    super();
    window.addEventListener('mousemove', evt => this.mouseMove(evt));
    window.addEventListener('touchmove', evt => this.touchMove(evt));
    window.addEventListener('mouseup', () => this.mouseUp());
    window.addEventListener('touchend', () => this.touchEnd());
  }

  resetDrag() {
    this.cummulativeDeltaX = 0;
    this.cummulativeDeltaY = 0;
  }

  addDropElement(element: DropTargetElement): void {
    this.dropTargets.push({
      element,
      dropType: 'dropOk',
      minDeltaX: 0,
      maxDeltaX: 0,
      minDeltaY: 0,
      maxDeltaY: 0,
    });
  }

  removeDropElements(elementIds: string[]): void {
    this.dropTargets = this.dropTargets.filter(
      elm => !elementIds.includes(elm.element.id)
    );
  }

  clearDropElements(): void {
    this.dropTargets.length = 0; // Setting the length of an array to 0 clears the array
  }

  markAsWrongDrop(element: DropTargetElement): void {
    const targetToUpdate = this.dropTargets.find(
      target => element === target.element
    );
    if (targetToUpdate !== undefined) targetToUpdate.dropType = 'dropWrong';
  }

  markAllTargetsAsDropOk(): void {
    for (const dropTarget of this.dropTargets) {
      dropTarget.dropType = 'dropOk';
    }
  }

  private mouseDown() {
    this.determineDragBoundaries();
    this.dragActive = true;
  }

  private touchStart(evt: TouchEvent): void {
    this.determineDragBoundaries();
    this.dragActive = true;
    this.touchPreviousScreenX = evt.changedTouches[0].screenX;
    this.touchPreviousScreenY = evt.changedTouches[0].screenY;
  }

  private mouseMove(evt: MouseEvent) {
    if (this.dragActive) {
      this.drag(evt.movementX, evt.movementY);
    }
  }

  private touchMove(evt: TouchEvent): void {
    if (this.dragActive) {
      const deltaX = evt.changedTouches[0].screenX - this.touchPreviousScreenX;
      const deltaY = evt.changedTouches[0].screenY - this.touchPreviousScreenY;
      this.touchPreviousScreenX = evt.changedTouches[0].screenX;
      this.touchPreviousScreenY = evt.changedTouches[0].screenY;
      this.drag(deltaX, deltaY);
    }
  }

  private mouseUp() {
    if (this.dragActive) {
      this.handleEndOfDrag();
      this.dragActive = false;
    }
  }

  private touchEnd(): void {
    if (this.dragActive) {
      this.handleEndOfDrag();
      this.dragActive = false;
    }
  }

  private determineDragBoundaries(): void {
    const rectDraggable = this.getBoundingClientRect();

    // First we determine the minimum and maximum deltaX and delta to prevent falling off the screen/
    this.minCummlativeDeltaX =
      (-rectDraggable.left / getRealViewportWidth()) * 100 +
      this.cummulativeDeltaX;
    this.maxCummulativeDeltaX =
      ((window.innerWidth - rectDraggable.right) / getRealViewportWidth()) *
        100 +
      this.cummulativeDeltaX;
    this.minCummalativeDeltaY =
      (-rectDraggable.top / getRealViewportHeight()) * 100 +
      this.cummulativeDeltaY;
    this.maxCummalativeDeltaY =
      ((window.innerHeight - rectDraggable.bottom) / getRealViewportHeight()) *
        100 +
      this.cummulativeDeltaY;

    // Determine the middle area of the draggable.
    const rectMiddleOfDraggable = { left: 0, right: 0, top: 0, bottom: 0 };
    rectMiddleOfDraggable.left =
      rectDraggable.left +
      ((1 - this.dropAreaPercentage / 100) / 2) *
        (rectDraggable.right - rectDraggable.left);
    rectMiddleOfDraggable.right =
      rectDraggable.right -
      ((1 - this.dropAreaPercentage / 100) / 2) *
        (rectDraggable.right - rectDraggable.left);
    rectMiddleOfDraggable.top =
      rectDraggable.top +
      ((1 - this.dropAreaPercentage / 100) / 2) *
        (rectDraggable.bottom - rectDraggable.top);
    rectMiddleOfDraggable.bottom =
      rectDraggable.bottom -
      ((1 - this.dropAreaPercentage / 100) / 2) *
        (rectDraggable.bottom - rectDraggable.top);

    // For each drop target, determine when the draggable is over the drop target
    for (const target of this.dropTargets) {
      const rectTarget = target.element.getBoundingClientRect();

      target.maxDeltaX =
        ((rectTarget.right - rectMiddleOfDraggable.left) /
          getRealViewportWidth()) *
          100 +
        this.cummulativeDeltaX;
      target.minDeltaX =
        ((rectTarget.left - rectMiddleOfDraggable.right) /
          getRealViewportWidth()) *
          100 +
        this.cummulativeDeltaX;
      target.maxDeltaY =
        ((rectTarget.bottom - rectMiddleOfDraggable.top) /
          getRealViewportHeight()) *
          100 +
        this.cummulativeDeltaY;
      target.minDeltaY =
        ((rectTarget.top - rectMiddleOfDraggable.bottom) /
          getRealViewportHeight()) *
          100 +
        this.cummulativeDeltaY;
    }
  }

  private handleEndOfDrag(): void {
    for (const target of this.dropTargets) {
      target.element.highlightForDrop('none');
      if (
        this.cummulativeDeltaX > target.minDeltaX &&
        this.cummulativeDeltaX < target.maxDeltaX &&
        this.cummulativeDeltaY > target.minDeltaY &&
        this.cummulativeDeltaY < target.maxDeltaY
      ) {
        const event = new DropEvent();
        event.draggableId = this.id;
        event.draggableValue = this.value;
        event.dropTargetId = target.element.id;
        event.dropTargetValue = target.element.value || '';
        event.dropType = target.dropType;
        this.dispatchEvent(event);
        break;
      }
    }
    if (this.resetDragAfterDrop) this.resetDrag();
  }

  private drag(deltaX: number, deltaY: number): void {
    const deltaXinVw = (deltaX / getRealViewportWidth()) * 100;
    const deltaYinVh = (deltaY / getRealViewportHeight()) * 100;

    this.cummulativeDeltaX += deltaXinVw;
    this.cummulativeDeltaY += deltaYinVh;

    // If we have crossed past the window, set the movement to the boundary of the window
    if (this.cummulativeDeltaX < this.minCummlativeDeltaX)
      this.cummulativeDeltaX = this.minCummlativeDeltaX;
    else if (this.cummulativeDeltaX > this.maxCummulativeDeltaX)
      this.cummulativeDeltaX = this.maxCummulativeDeltaX;
    if (this.cummulativeDeltaY < this.minCummalativeDeltaY)
      this.cummulativeDeltaY = this.minCummalativeDeltaY;
    else if (this.cummulativeDeltaY > this.maxCummalativeDeltaY)
      this.cummulativeDeltaY = this.maxCummalativeDeltaY;

    // For each of the drop targets, check whether it's touched and if so highlight it appropriately.
    for (const target of this.dropTargets) {
      if (
        this.cummulativeDeltaX > target.minDeltaX &&
        this.cummulativeDeltaX < target.maxDeltaX &&
        this.cummulativeDeltaY > target.minDeltaY &&
        this.cummulativeDeltaY < target.maxDeltaY
      ) {
        if (target.dropType === 'dropOk')
          target.element.highlightForDrop('droppable');
        else if (target.dropType === 'dropWrong')
          target.element.highlightForDrop('wrong');
      } else {
        target.element.highlightForDrop('none');
      }
    }
  }

  protected async firstUpdated(): Promise<void> {
    await this.updateComplete;
    this.determineDragBoundaries();
    this.addEventListener('mousedown', () => this.mouseDown());
    this.addEventListener('touchstart', evt => this.touchStart(evt));
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block-inline;
        );
      }
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <style>
        :host {
          transform: translate(
            calc(${this.cummulativeDeltaX} * var(--vw, 1vw)),
            calc(${this.cummulativeDeltaY} * var(--vh, 1vh))
          );
        }
      </style>
      ${this.content}
    `;
  }
}
