import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { state } from 'lit/decorators.js';

// eslint-disable-next-line import/extensions
import { classMap } from 'lit/directives/class-map.js';

import { create } from 'mutative';

import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

export interface ItemInfoInterface {
  correct: boolean;
  disabled: boolean;
}

export interface RoundInfo<ExerciseInfo, ItemInfo> {
  exerciseInfo: ExerciseInfo;
  itemInfo: ItemInfo[];
}

export abstract class AscendingItemsGameApp<
  ExerciseInfo,
  ItemInfo extends ItemInfoInterface,
> extends TimeLimitedGame2 {
  @state()
  private accessor roundInfo: RoundInfo<ExerciseInfo, ItemInfo> | undefined;
  @state()
  private accessor ascending = false;
  private gameActive = false;

  /** Render one item
   * Size is set by ascending item game app
   */
  protected abstract renderItem(itemInfo: ItemInfo): HTMLTemplateResult;

  /** Render exercise
   *
   */
  protected abstract renderExercise(
    exerciseInfo: ExerciseInfo,
  ): HTMLTemplateResult;

  /** Get items for one round
   * nmbrItems items should be returned
   * For one item, correct should be true, for all other it should be false
   */
  protected abstract getRoundInfo(
    nmbrItems: number,
  ): RoundInfo<ExerciseInfo, ItemInfo>;

  /** Start a new game.
   */
  startNewGame(): void {
    console.log(`start new game called`);
    super.startNewGame();
    this.gameActive = true;
    this.startNewRound();
  }

  /** Start new round.
   */
  startNewRound(): void {
    this.roundInfo = this.getRoundInfo(4);
    this.ascending = true;
    this.restartAscension();
  }

  /* Restart the balloon ascension from the bottom.
   */
  async restartAscension(): Promise<void> {
    await this.reset();
    this.ascending = true;
  }

  /** Reset the balloons to the bottom and stop movement.
   * Wait until the promise resolves before starting ascension again as
   * otherwise the reset might be missed by the browser.
   */
  async reset(): Promise<void> {
    this.ascending = false;
    await this.performUpdate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dummy = this.offsetWidth; // This is a dummy command to force a reflow such that the animation is reset.
  }

  private ascensionComplete(): void {
    if (this.gameActive) {
      this.numberNok += 1;
      this.startNewRound();
    }
  }

  handleGameOver(): void {
    super.handleGameOver();
    this.roundInfo = undefined;
    this.gameActive = false;
  }

  private handleItemClicked(itemIndex: number): void {
    if (this.roundInfo) {
      if (this.roundInfo.itemInfo[itemIndex].correct) {
        this.numberOk += 1;
        this.startNewRound();
      } else if (!this.roundInfo.itemInfo[itemIndex].disabled) {
        this.numberNok += 1;
        this.roundInfo = create(this.roundInfo, draft => {
          draft.itemInfo[itemIndex].disabled = true;
        });
      }
    }
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        div#gameArea {
          display: grid;
          grid-template-rows: 5% 23% auto 12%;
          grid-template-columns: 100%;
          grid-template-areas:
            'top'
            'exercise'
            'empty'
            'items';
          width: 100%;
          height: 100%;
          container-type: size;
          container-name: gameArea;
        }

        div#itemBox {
          width: 100%;
          display: flex;
          justify-content: space-around;
          grid-area: items;
          align-items: flex-end;
        }

        div#exercizeBox {
          width: 100%;
          display: flex;
          justify-content: space-around;
          grid-area: exercise;
        }

        div.exercize {
          height: 22vmin;
        }

        div.item {
          width: calc(11vmin);
          height: calc(11vmin);
        }

        .MoveUp {
          animation-name: MoveUp;
          animation-duration: 10s;
          animation-delay: 0.05s; /* Needed to ensure iOS safari has sufficient time to process restarts of the animation */
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @keyframes MoveUp {
          from {
            transform: translate(0px, -0px);
          }
          to {
            transform: translate(0px, -100cqh);
          }
        }
      `,
    ];
  }
  /*  */

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    const itemBoxClasses = { MoveUp: this.ascending };

    console.log(`renderGameContent roundInfo = ${this.roundInfo}`);
    return html`
      <div id="gameArea">
        <div id="exercizeBox">
          <div class="exercize">
            ${this.roundInfo !== undefined
              ? this.renderExercise(this.roundInfo.exerciseInfo)
              : html``}
          </div>
        </div>
        <div
          id="itemBox"
          class=${classMap(itemBoxClasses)}
          @animationend=${() => this.ascensionComplete()}
        >
          ${this.roundInfo?.itemInfo.map(
            (itm, idx) =>
              html`<div
                class="item"
                @click=${() => this.handleItemClicked(idx)}
              >
                ${this.renderItem(itm)}
              </div>`,
          )}
        </div>
      </div>
    `;
  }
}
