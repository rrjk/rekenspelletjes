import { CSSResultArray, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HTMLTemplateResult } from 'lit';
import {
  DraggableElement,
  DropTargetElementInterface,
  HighlightType,
} from './DraggableElement';

import { gcd } from './NumberHelperFunctions';

@customElement('draggable-target-fraction')
export class DraggableTargetFraction
  extends DraggableElement
  implements DropTargetElementInterface
{
  @state()
  private accessor dropState: HighlightType = 'none';

  @property()
  accessor numerator = 1;
  @property()
  accessor denumerator = 2;

  get value() {
    const _gcd = gcd(this.numerator, this.denumerator);
    return `${this.numerator / _gcd}/${this.denumerator / _gcd}`;
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        div {
          width: 100%;
          height: 100%;
          border: 2px solid blue;
        }
      `,
    ];
  }

  render(): HTMLTemplateResult {
    //eslint-disable-next-line lit/no-this-assign-in-render -- Legacy
    this.content = html`<div>
      ${this.numerator}/${this.denumerator} (${this.value}) </br> ${this.dropState}
    </div>`;
    return html` ${super.render()}`;
  }

  highlightForDrop(newState: HighlightType): void {
    this.dropState = newState;
  }
}
