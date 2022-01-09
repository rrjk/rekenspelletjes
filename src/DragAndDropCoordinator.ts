export interface Draggable extends HTMLElement {
  /** Drag the element by the vector (x,y)
   * All subsequent drags are cummulative.
   */
  drag(x: number, y: number): void;
  /** Return the element to its original position */
  resetDrag(): void;
}

type DraggableInformation = null | {
  name: string;
  disabled: boolean;
  element: Draggable;
};

export class DragAndDropCoordinator {
  private draggables = new Map<string, DraggableInformation>();
  private draggedElement: DraggableInformation = null;
  private touchPreviousScreenX = 0;
  private touchPreviousScreenY = 0;

  constructor() {
    window.addEventListener('mousemove', evt => this.mouseMove(evt));
    window.addEventListener('touchmove', evt => this.touchMove(evt));
    window.addEventListener('mouseup', () => this.mouseUp());
    window.addEventListener('touchend', () => this.touchEnd());
  }

  mouseMove(evt: MouseEvent) {
    if (this.draggedElement != null) {
      this.draggedElement.element.drag(evt.movementX, evt.movementY);
    }
  }

  touchMove(evt: TouchEvent): void {
    if (this.draggedElement != null) {
      const deltaX = evt.changedTouches[0].screenX - this.touchPreviousScreenX;
      const deltaY = evt.changedTouches[0].screenY - this.touchPreviousScreenY;
      this.touchPreviousScreenX = evt.changedTouches[0].screenX;
      this.touchPreviousScreenY = evt.changedTouches[0].screenY;
      this.draggedElement.element.drag(deltaX, deltaY);
    }
  }

  mouseUp() {
    if (this.draggedElement != null) {
      this.draggedElement = null;
    }
  }

  touchEnd(): void {
    if (this.draggedElement != null) {
      this.draggedElement = null;
    }
  }

  mouseDown(element: DraggableInformation) {
    this.draggedElement = element;
  }

  touchStart(element: DraggableInformation, evt: TouchEvent): void {
    this.draggedElement = element;
    this.touchPreviousScreenX = evt.changedTouches[0].screenX;
    this.touchPreviousScreenY = evt.changedTouches[0].screenY;
  }

  addDraggable(name: string, draggable: Draggable): void {
    const element: DraggableInformation = {
      name,
      disabled: false,
      element: draggable,
    };
    this.draggables.set(name, element);

    draggable.addEventListener('mousedown', () => this.mouseDown(element));
    draggable.addEventListener('touchstart', evt =>
      this.touchStart(element, evt)
    );
  }
}
