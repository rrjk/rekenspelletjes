import { customElement, property } from 'lit/decorators.js';
import { DraggableTargetSlotted } from './DraggableTargetSlotted';

@customElement('draggable-target-slotted-cell-element')
export class DraggableTargetSlottedCellElement extends DraggableTargetSlotted {
  @property({ type: Number })
  accessor gridIndex = -1;
}
