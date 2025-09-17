import { html, css, nothing } from 'lit';

import { state } from 'lit/decorators.js';

import { createRef, ref } from 'lit/directives/ref.js';

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
  private gameActive = false;

  private itemBox = createRef();

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
    super.startNewGame();
    this.gameActive = true;
    this.startNewRound();
  }

  /** Start new round.
   */
  startNewRound(): void {
    this.roundInfo = this.getRoundInfo(4);
    this.restartAscension();
  }

  /* Restart the balloon ascension from the bottom.
   */
  restartAscension(): void {
    //    await this.reset();
    //    this.ascending = true;
    if (!this.itemBox.value) {
      throw new Error(
        `Ascension cannot be restarted when the itemBox has not yet been rendered`,
      );
    }
    if (this.itemBox.value.getAnimations().length === 0) {
      this.itemBox.value.animate(
        [
          { transform: 'translate(0px, -0px)' },
          { transform: 'translate(0px, -100cqh)' },
        ],
        {
          duration: 10000,
          //          delay: 100 /* Needed to ensure iOS safari has sufficient time to process restarts of the animation */,
          fill: 'forwards',
        },
      );
    }
    for (const a of this.itemBox.value.getAnimations()) {
      a.play();
      a.finished
        .then(() => {
          this.ascensionComplete();
        })
        .catch(() => {
          /* When the animation is cancelled, we don't need to do anything */
        });
    }
  }

  cancelAscension(): void {
    if (this.itemBox.value !== undefined) {
      for (const a of this.itemBox.value.getAnimations()) {
        a.cancel();
      }
    }
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
        this.cancelAscension();
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
          width: calc(15vmin);
          height: calc(15vmin);
        }
      `,
    ];
  }
  /*  */

  /** Render the game content */
  renderGameContent(): HTMLTemplateResult {
    return html`
      <div id="gameArea">
        <div id="exercizeBox">
          <div class="exercize">
            ${this.roundInfo !== undefined
              ? this.renderExercise(this.roundInfo.exerciseInfo)
              : nothing}
          </div>
        </div>
        <div id="itemBox" ${ref(this.itemBox)}>
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
