import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';

import { DropTargetElement, HighlightType } from './DraggableElement';

type BoxSize = 'Smallest' | 'Small' | 'Big' | 'Biggest';

@customElement('drop-target-box')
export class DropTargetBox extends LitElement implements DropTargetElement {
  @property({ type: String })
  size: BoxSize = 'Smallest';

  @state()
  highlighted: HighlightType = 'none';

  highlightForDrop(newState: HighlightType): void {
    this.highlighted = newState;
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      .box {
        display: flex;
        background-image: url('images/red-box.png');
        background-size: contain;
        text-align: center;
        justify-content: center;
        align-items: center;
        box-sizing: content-box;
      }

      .highlightDroppable {
        background-color: grey;
      }

      .highlightWrong {
        background-color: salmon;
      }

      @media (min-aspect-ratio: 2/3) {
        .boxSmallest {
          height: 12vh;
          width: 12.05vh;
        }

        .boxSmall {
          height: 25vh;
          width: 25.11vh;
        }

        .boxBig {
          height: 35vh;
          width: 35.16vh;
        }

        .boxBiggest {
          height: 45vh;
          width: 45.2vh;
        }
      }

      @media (max-aspect-ratio: 2/3) {
        .boxSmallest {
          height: 7.96vw;
          width: 8vw;
        }

        .boxSmall {
          height: 11.95vw;
          width: 12vw;
        }

        .boxBig {
          height: 15.93vw;
          width: 16vw;
        }

        .boxBiggest {
          height: 19.91vw;
          width: 20vw;
        }
      }
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <div
        draggable="false"
        alt="smallest box"
        class="box box${this.size} ${this.highlighted === 'droppable'
          ? 'highlightDroppable'
          : ''} ${this.highlighted === 'wrong' ? 'highlightWrong' : ''}"
      >
        <slot></slot>
      </div>
    `;
  }
}
