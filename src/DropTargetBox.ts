import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';

import { DropTargetElement, HighlightType } from './DraggableElement';

type BoxSize = 'Smallest' | 'Small' | 'Big' | 'Biggest';

@customElement('drop-target-box')
export class DropTargetBox extends LitElement implements DropTargetElement {
  @property({ type: String })
  size: BoxSize = 'Smallest';

  @property({ type: String })
  boxColor = 'red';

  @state()
  tallWide: 'Tall' | 'Wide' = 'Tall';

  @state()
  highlighted: HighlightType = 'none';

  highlightForDrop(newState: HighlightType): void {
    this.highlighted = newState;
  }

  constructor() {
    super();
    window.addEventListener('resize', () => {
      this.updateViewPortDimensions();
    });
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      .box {
        display: flex;
        background-repeat: no-repeat;
        background-position: center center;
        text-align: center;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }

      .boxRed {
        background-image: url('${unsafeCSS(
          new URL('../images/red-box.png', import.meta.url)
        )}');
      }

      .boxBlue {
        background-image: url('${unsafeCSS(
          new URL('../images/blue-box.png', import.meta.url)
        )}');
      }

      .highlightDroppable {
        background-color: transparent;
      }

      .highlightWrong {
        background-color: transparent;
      }

      .boxSmallestTall {
        background-size: 30% auto;
      }

      .boxSmallTall {
        background-size: 50% auto;
      }

      .boxBigTall {
        background-size: 70% auto;
      }

      .boxBiggestTall {
        background-size: 90% auto;
      }

      .boxSmallestWide {
        background-size: auto 30%;
      }

      .boxSmallWide {
        background-size: auto 50%;
      }

      .boxBigWide {
        background-size: auto 70%;
      }

      .boxBiggestWide {
        background-size: auto 90%;
      }
    `;
  }

  updateViewPortDimensions() {
    if (this.clientWidth > this.clientHeight) this.tallWide = 'Wide';
    else this.tallWide = 'Tall';
  }

  async firstUpdated(): Promise<void> {
    await this.getUpdateComplete();
    this.updateViewPortDimensions();
  }

  render(): HTMLTemplateResult {
    let boxColorClass = 'boxRed';
    if (this.boxColor === 'blue') boxColorClass = 'boxBlue';
    return html`
      <div
        alt="smallest box"
        class="box ${boxColorClass} box${this.size}${this.tallWide} ${this
          .highlighted === 'droppable'
          ? 'highlightDroppable'
          : ''} ${this.highlighted === 'wrong' ? 'highlightWrong' : ''}"
      >
        <slot></slot>
      </div>
    `;
  }
}
