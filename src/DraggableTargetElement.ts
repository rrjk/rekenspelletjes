import { CSSResultArray, LitElement, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state, property } from 'lit/decorators.js';
import type { HTMLTemplateResult } from 'lit';
import {
  DraggableElement,
  DropTargetElement,
  HighlightType,
} from './DraggableElement';

@customElement('draggable-target-element')
export class DraggableTargetElement
  extends DraggableElement
  implements DropTargetElement
{
  @state()
  private backgroundColor = 'transparent';

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        :host {
          background-color: var(--background-color);
        }
      `,
    ];
  }

  render(): HTMLTemplateResult {
    return html` <style>
        :host {
          --background-color: ${this.backgroundColor};
        }
      </style>
      ${super.render()}`;
  }

  highlightForDrop(newState: HighlightType): void {
    if (newState === 'none') this.backgroundColor = 'transparent';
    else if (newState === 'droppable') this.backgroundColor = 'lightgrey';
    else if (newState === 'wrong') this.backgroundColor = 'teal';
  }
}
