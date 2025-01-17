import { CSSResultArray, html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { HTMLTemplateResult } from 'lit';
import {
  DraggableElement,
  DropTargetElementInterface,
  HighlightType,
} from './DraggableElement';
import { getHeartasHTMLTemplateResult } from './HeartImage';
import { Color } from './Colors';

@customElement('draggable-target-heart')
export class DraggableTargetHeart
  extends DraggableElement
  implements DropTargetElementInterface
{
  @state()
  private accessor backgroundColor = 'transparent';

  @state()
  private accessor heartColor: Color = 'red';

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
    this.content = html`${getHeartasHTMLTemplateResult(
      this.heartColor,
      `${this.value}`,
    )}`;
    return html` <style>
        :host {
          --background-color: ${this.backgroundColor};
        }
      </style>
      ${super.render()}`;
  }

  highlightForDrop(newState: HighlightType): void {
    if (newState === 'none') this.heartColor = 'red';
    else if (newState === 'droppable') this.heartColor = 'maroon';
    else if (newState === 'wrong') this.heartColor = 'grey';
  }
}
