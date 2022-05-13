import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import type { ResizeObserverClientInterface } from './ResizeObserver';
import {
  removeResizeObserverClient,
  addResizeObserverClient,
} from './ResizeObserver';
import { renderLabelAsSvg } from './renderLabelAsSvg';
import { randomFromSet, randomIntFromRange } from './Randomizer';

type ImageColorClasses = 'ballBlue' | 'ballRed' | 'ballYellow' | 'ballGreen';
const possibleImageColorClasses: ImageColorClasses[] = [
  'ballBlue',
  'ballRed',
  'ballYellow',
  'ballGreen',
];

interface BallInformation {
  /** Label of the ball */
  label: string;
  /** Image class for the ball */
  imageClass: ImageColorClasses;
  /** Factor for movement of ball in X direction, 0 means to the left border, 1 means to the right border */
  deltaXFactor: number;
  /** Factor for movement of ball in Y direction, 0 means to the top border, 1 means to the bottom border */
  deltaYFactor: number;
}

@customElement('ball-field-entry')
export class BallFieldEntry
  extends LitElement
  implements ResizeObserverClientInterface
{
  @property({ attribute: false })
  ballLabels: string[] = [];
  @property({ attribute: false })
  disabledBallLabels: string[] = [];
  @property({ attribute: false })
  invisibleBallLabels: string[] = [];

  @property({ type: String })
  exercise = '';
  @property({ type: Number })
  minimumExerciseAspectRatio = 2;

  @property({ type: Boolean })
  disabled = false;

  @state()
  selectedExerciseAspectRatio = 0;
  @state()
  randomizedBallInfoList: BallInformation[] = [];
  @state()
  ballHeightWidth = 0;
  @state()
  perRow = 0;
  @state()
  perColumn = 0;
  @state()
  exerciseIndex = 0;
  @state()
  numberExerciseCells = 0;

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: space-around;
        background-color: #cd86e3;
      }

      .fadeOut {
        animation: FadeOut 0.75s;
        animation-fill-mode: forwards;
      }

      @keyframes FadeOut {
        from {
          transform: scale(1);
        }
        to {
          transform: scale(0.3);
          opacity: 0;
          visibility: hidden;
        }
      }

      .flexItem {
        display: flex;
        display: flex;
        flex-wrap: wrap;
        width: calc(100% / var(--perRow));
        height: calc(100% / var(--perColumn));
        box-sizing: border-box;
        border: none;
      }

      .exerciseFlexItem {
        display: flex;
        display: flex;
        flex-wrap: wrap;
        width: calc((100% / var(--perRow)) * var(--exerciseCellWidth));
        height: calc(100% / var(--perColumn));
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        border: none;
      }

      .ball {
        background-color: transparent;
        outline: none;
        padding: 0;
        position: relative;
        width: var(--ballHeightWidth);
        height: var(--ballHeightWidth);
        border: none;
      }

      .ballBlue {
        background-image: url('images/ball-blue.svg');
      }

      .ballRed {
        background-image: url('images/ball-red.svg');
      }

      .ballGreen {
        background-image: url('images/ball-green.svg');
      }

      .ballYellow {
        background-image: url('images/ball-yellow.svg');
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    addResizeObserverClient(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    removeResizeObserverClient(this);
  }

  handleBallClick(label: string): void {
    if (
      this.invisibleBallLabels.includes(label) ||
      this.disabledBallLabels.includes(label)
    ) {
      throw Error(
        'A invisible or disabled ball was clicked, this should not happen'
      );
    } else {
      const event = new CustomEvent('ball-clicked', {
        detail: { label },
      });
      this.dispatchEvent(event);
    }
  }

  willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has('ballLabels')) {
      this.determineNumberRowsAndColumns();
      this.shuffleBalls();
    }
  }

  handleResize(): void {
    this.determineNumberRowsAndColumns();
  }

  shuffleBalls(): void {
    const notYetAssignedLabels = [...this.ballLabels];
    this.randomizedBallInfoList = [];
    while (notYetAssignedLabels.length > 0) {
      const toBeAssignedLabelIndex = randomIntFromRange(
        0,
        notYetAssignedLabels.length - 1
      );

      this.randomizedBallInfoList.push({
        label: notYetAssignedLabels[toBeAssignedLabelIndex],
        imageClass: randomFromSet(possibleImageColorClasses),
        deltaXFactor: Math.random(),
        deltaYFactor: Math.random(),
      });
      notYetAssignedLabels.splice(toBeAssignedLabelIndex, 1);
    }
  }

  /** Return whether a ball with given label is disabled
   * @param label - Label to check
   */
  ballDisabled(label: string): boolean {
    return this.disabledBallLabels.includes(label);
  }

  /** Return whether a ball with given label is visible
   * @param label - Label to check
   */
  ballVisible(label: string): boolean {
    return !this.invisibleBallLabels.includes(label);
  }

  determineNumberRowsAndColumns() {
    const boxAspectRatio = this.clientWidth / this.clientHeight;

    const ratioPerRowPerColumn = boxAspectRatio;

    const minimumNumberExerciseCells = this.exercise === '' ? 0 : 1;
    const minimumNumberCells =
      minimumNumberExerciseCells + this.ballLabels.length;

    const perColumnCeiled = Math.ceil(
      Math.sqrt(minimumNumberCells / ratioPerRowPerColumn)
    );
    const perColumnFloored = Math.floor(
      Math.sqrt(minimumNumberCells / ratioPerRowPerColumn)
    );

    const resultingRatioRowPerColumnCeiled =
      Math.ceil(minimumNumberCells / perColumnCeiled) / perColumnCeiled;
    const resultingRatioRowPerColumnFloored =
      Math.ceil(minimumNumberCells / perColumnFloored) / perColumnFloored;

    if (
      Math.abs(resultingRatioRowPerColumnCeiled - ratioPerRowPerColumn) >
      Math.abs(resultingRatioRowPerColumnFloored - ratioPerRowPerColumn)
    ) {
      this.perColumn = perColumnFloored;
    } else {
      this.perColumn = perColumnCeiled;
    }

    this.perRow = Math.ceil(minimumNumberCells / this.perColumn);
    /* It's possible that with this number of cells per row, we need less columns, so we redetermine the number of columns */
    this.perColumn = Math.ceil(minimumNumberCells / this.perRow);

    const numberCells = this.perColumn * this.perRow;
    const availableExerciseCells = numberCells - this.ballLabels.length;

    if (minimumNumberExerciseCells > 0) {
      if (this.perRow % 2 === 0 && availableExerciseCells > 1) {
        this.numberExerciseCells = 2;
      } else {
        this.numberExerciseCells = 1;
      }
      const exerciseRow = Math.ceil(this.perColumn / 2) - 1;
      const excerciseColumn = Math.ceil(this.perRow / 2) - 1;

      this.exerciseIndex = this.perRow * exerciseRow + excerciseColumn;
    } else {
      this.exerciseIndex = 0;
      this.numberExerciseCells = 0;
    }

    const flexItemWidth = this.clientWidth / this.perRow;
    const flexItemHeight = this.clientHeight / this.perColumn;
    const exerciseFlexItemWidth = flexItemWidth * this.numberExerciseCells;
    this.selectedExerciseAspectRatio = Math.max(
      this.minimumExerciseAspectRatio,
      exerciseFlexItemWidth / flexItemHeight
    );

    if (flexItemWidth > flexItemHeight)
      this.ballHeightWidth = 0.4 * flexItemHeight;
    else this.ballHeightWidth = 0.4 * flexItemWidth;
  }

  protected render(): HTMLTemplateResult {
    const flexItems: HTMLTemplateResult[] = [];

    /* Some design notes
     * A div is put around the actual image to control the number of items in a row,
     * using width and hight the div it's ensured we get the right number of images in a row,
     * in stead of as many as could possibly fit.
     */

    for (let i = 0; i < this.randomizedBallInfoList.length; i++) {
      const ballInfo = this.randomizedBallInfoList[i];
      let ballButton = html``;
      const fadeOutClass = this.ballVisible(ballInfo.label) ? '' : 'fadeOut';
      ballButton = this.disabled
        ? html``
        : html`
            <button
              ?disabled=${this.ballDisabled(ballInfo.label)}
              class="${fadeOutClass} ball  ${ballInfo.imageClass}"
              @click=${() => this.handleBallClick(ballInfo.label)}
              style="top: calc(${ballInfo.deltaYFactor} * (100% - var(--ballHeightWidth)));; left: calc(${ballInfo.deltaXFactor} * (100% - var(--ballHeightWidth)));"
            >
              ${renderLabelAsSvg(
                this.ballDisabled(ballInfo.label) ? '✗' : ballInfo.label
              )}
            </button>
          `;
      if (i === this.exerciseIndex && this.numberExerciseCells > 0) {
        flexItems.push(
          html`<div class="exerciseFlexItem">
            ${this.disabled
              ? ''
              : renderLabelAsSvg(
                  this.exercise,
                  this.selectedExerciseAspectRatio,
                  70
                )}
          </div>`
        );
      }
      flexItems.push(html`<div class="flexItem">${ballButton}</div>`);
    }

    return html`
      <style>
        :host {
          --ballHeightWidth: ${this.ballHeightWidth}px;
          --exerciseCellWidth: ${this.numberExerciseCells};
          --perColumn: ${this.perColumn};
          --perRow: ${this.perRow};
        }
      </style>
      ${flexItems}
    `;
  }
}
