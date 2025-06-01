/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import { LitElement, html, css, nothing } from 'lit';

import { property } from 'lit/decorators.js';

import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { randomIntFromRange } from './Randomizer';

interface BallInfo {
  label: string;
  disabled: boolean;
  show: true;
  removed: boolean;
  factorX: number;
  factorY: number;
  cell: number;
  image: URL;
}

interface NotShownBallInfo {
  show: false;
}

/* Custom element to create a field of balls that can be clicked
    --ballFieldWidth the width of the ballField
    --ballFieldHeight the height of the ballField.
*/
export class BallFieldEntry extends LitElement {
  preventCollisionElements: HTMLElement[];
  balls: (BallInfo | NotShownBallInfo)[];

  @property({ type: Array })
  accessor labels: string[];

  static get styles(): CSSResultGroup {
    return css`
      .FadeOut {
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
      .BallBlock {
        height: var(--ballFieldHeight);
        width: var(--ballFieldWidth);
        margin: 0;
        padding: 0;
        left: 0;
        top: 0;
        display: flex;
        flex-wrap: wrap;
        border: none;
      }

      .Cell12,
      .Cell20 {
        border: none;
        margin: 0;
        padding: 0;
        height: var(--cellHeight);
        width: var(--cellWidth);
        --ballWidth: calc(min(var(--cellWidth) / 2.5, var(--cellHeight) / 2.5));
        --ballHeight: calc(
          min(var(--cellWidth) / 2.5, var(--cellHeight) / 2.5)
        );
      }

      .Ball {
        background-size: 100%;
        background-color: Transparent;
        border: none;
        outline: none;
        position: absolute;
        padding: 0;
        color: black;
        font-size: calc(0.6 * var(--ballWidth));
        width: var(--ballWidth);
        height: var(--ballHeight);
      }

      @media (min-aspect-ratio: 5/2) {
        .Cell12 {
          --cellWidth: calc(var(--ballFieldWidth) / 6 - 2px);
          --cellHeight: calc(var(--ballFieldHeight) / 2 - 2px);
        }
        .Cell20 {
          --cellWidth: calc(var(--ballFieldWidth) / 7 - 2px);
          --cellHeight: calc(var(--ballFieldHeight) / 3 - 2px);
        }
      }

      @media (min-aspect-ratio: 1/1) and (max-aspect-ratio: 5/2) {
        .Cell12 {
          --cellWidth: calc(var(--ballFieldWidth) / 4 - 2px);
          --cellHeight: calc(var(--ballFieldHeight) / 3 - 2px);
        }
        .Cell20 {
          --cellWidth: calc(var(--ballFieldWidth) / 5 - 2px);
          --cellHeight: calc(var(--ballFieldHeight) / 4 - 2px);
        }
      }

      @media (min-aspect-ratio: 2/5) and (max-aspect-ratio: 1/1) {
        .Cell12 {
          --cellWidth: calc(var(--ballFieldWidth) / 3 - 2px);
          --cellHeight: calc(var(--ballFieldHeight) / 4 - 2px);
        }
        .Cell20 {
          --cellWidth: calc(var(--ballFieldWidth) / 4 - 2px);
          --cellHeight: calc(var(--ballFieldHeight) / 5 - 2px);
        }
      }

      @media (max-aspect-ratio: 2/5) {
        .Cell12 {
          --cellWidth: calc(var(--ballFieldWidth) / 2 - 2px);
          --cellHeight: calc(var(--ballFieldHeight) / 6 - 2px);
        }
        .Cell20 {
          --cellWidth: calc(var(--ballFieldWidth) / 3 - 2px);
          --cellHeight: calc(var(--ballFieldHeight) / 7 - 2px);
        }
      }
    `;
  }

  constructor() {
    super();
    this.preventCollisionElements = [];
    this.labels = [];
    this.balls = [];
  }

  initializeBalls(): void {
    this.balls = [];
    if (this.labels.length > 12) {
      for (let i = 0; i < 20; i++) {
        this.balls.push({ show: false });
      }
    } else {
      for (let i = 0; i < 12; i++) {
        this.balls.push({ show: false });
      }
    }
    this.shuffleBalls();
  }

  setPreventCollisionElements(elements: HTMLElement[]): void {
    this.preventCollisionElements = elements;
  }

  shuffleBalls(): void {
    let possibleBalls = [];
    if (this.labels.length <= 12) {
      possibleBalls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    } else {
      possibleBalls = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      ];
    }
    const possibleColoredBackgroundImages = [
      new URL('../images/ball-blue.svg', import.meta.url),
      new URL('../images/ball-red.svg', import.meta.url),
      new URL('../images/ball-green.svg', import.meta.url),
      new URL('../images/ball-yellow.svg', import.meta.url),
    ];
    //eslint-disable-next-line @typescript-eslint/prefer-for-of -- legacy
    for (let i = 0; i < this.labels.length; i++) {
      const selectedBallId = randomIntFromRange(0, possibleBalls.length - 1);
      this.balls[possibleBalls[selectedBallId]] = {
        label: this.labels[i],
        disabled: false,
        show: true,
        removed: false,
        factorX: Math.random(),
        factorY: Math.random(),
        cell: possibleBalls[selectedBallId],
        image: possibleColoredBackgroundImages[randomIntFromRange(0, 3)],
      };
      /*
      this.balls[possibleBalls[selectedBallId]].label = this.labels[i];
      this.balls[possibleBalls[selectedBallId]].disabled = false;
      this.balls[possibleBalls[selectedBallId]].show = true;
      this.balls[possibleBalls[selectedBallId]].removed = false;
      this.balls[possibleBalls[selectedBallId]].factorX = Math.random();
      this.balls[possibleBalls[selectedBallId]].factorY = Math.random();
      this.balls[possibleBalls[selectedBallId]].cell =
        possibleBalls[selectedBallId];
      this.balls[possibleBalls[selectedBallId]].image =
        possibleColoredBackgroundImages[randomIntFromRange(0, 3)];
      */
      possibleBalls.splice(selectedBallId, 1);
    }
    possibleBalls.forEach(ballId => {
      this.balls[ballId] = { show: false };
      /*
      this.balls[ballId].disabled = true;
      this.balls[ballId].removed = false;
      */
    });
    this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();

    window.onresize = () => {
      this.preventOverlapForBalls();
    };

    this.initializeBalls();
  }

  setBallLabels(labels: string[]): void {
    this.labels = labels;
    this.initializeBalls();
  }

  handleBall(cell: number): void {
    const clickedBall = this.balls[cell];
    if (clickedBall.show === true) {
      // If the clicked ball is not shown we don't propagate
      // (this should not be possible as the ball is not shown)
      const event = new CustomEvent('input-clicked', {
        detail: { label: clickedBall.label, cell },
      });
      this.dispatchEvent(event);
    }
  }

  disableBall(cell: number): void {
    const ballToDisable = this.balls[cell];
    if (ballToDisable.show === true) {
      // If the ball is not shown, we can't and don't have to disable.
      ballToDisable.disabled = true;
    }
    this.requestUpdate();
  }

  enableBall(cell: number): void {
    const ballToDisable = this.balls[cell];
    if (ballToDisable.show === true) {
      // If the ball is not shown, we can't and don't have to enable.
      ballToDisable.disabled = false;
    }
    this.requestUpdate();
  }

  enableAllPresentBalls(): void {
    let numberPossibleBalls = 0;
    if (this.labels.length <= 12) {
      numberPossibleBalls = 12;
    } else {
      numberPossibleBalls = 20;
    }

    for (let i = 0; i < numberPossibleBalls; i++) {
      const ball = this.balls[i];
      if (ball.show === true) {
        ball.disabled = false;
      }
    }
    this.requestUpdate();
  }

  removeBall(cell: number): void {
    const ball = this.balls[cell];
    if (ball.show === true) {
      // If the ball is not shown, we can't and don't have to remove
      ball.removed = true;
    }
    this.requestUpdate();
  }

  makeBall(
    ball: BallInfo | NotShownBallInfo,
  ): HTMLTemplateResult | typeof nothing {
    if (ball.show) {
      let text;
      if (ball.disabled) text = '✗';
      else text = ball.label;

      return html` <button
        style="position: relative;
                      top: calc(${ball.factorX} * (100% - var(--ballWidth)));
                      left: calc(${ball.factorY} * (100% - var(--ballHeight)));
                      background-image: url('${ball.image}');"
        ?disabled=${ball.disabled}
        class="Ball ${ball.removed ? 'FadeOut' : ''}"
        id="Ball${ball.label}"
        @click=${() => this.handleBall(ball.cell)}
      >
        ${text}
      </button>`;
    }
    return nothing;
  }

  makeCell20(ball: BallInfo | NotShownBallInfo): HTMLTemplateResult {
    return html`<div class="Cell20">${this.makeBall(ball)}</div>`;
  }

  makeCell12(ball: BallInfo | NotShownBallInfo): HTMLTemplateResult {
    return html`<div class="Cell12">${this.makeBall(ball)}</div>`;
  }

  makeCells(): HTMLTemplateResult {
    if (this.labels.length <= 12)
      return html`${this.balls.map(ball => html`${this.makeCell12(ball)}`)}`;
    return html`${this.balls.map(ball => html`${this.makeCell20(ball)}`)}`;
  }

  render(): HTMLTemplateResult {
    return html` <div class="BallBlock">${this.makeCells()}</div> `;
  }

  updated(): void {
    this.preventOverlapForBalls();
  }

  /** Prevent that balls overlap with other elements on the screen. */
  preventOverlapForBalls(): void {
    const ballElements = this.renderRoot.querySelectorAll<HTMLElement>('.Ball');
    this.preventCollisionElements.forEach(element => {
      ballElements.forEach(ball => {
        this.preventOverlapForBall(ball, element);
      });
    });
  }

  rectangleIntersect(rect1: DOMRect, rect2: DOMRect): boolean {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  }

  preventOverlapForBall(ball: HTMLElement, element: HTMLElement): void {
    let rect1 = ball.getBoundingClientRect();
    const rect2 = element.getBoundingClientRect();
    let cnt = 0;
    while (cnt < 10 && this.rectangleIntersect(rect1, rect2)) {
      const factorY = Math.random();
      const factorX = Math.random();
      ball.style.top = `calc(${factorX} * (100% - var(--ballWidth)))`;
      ball.style.left = `calc(${factorY} * (100% - var(--ballHeight)))`;
      rect1 = ball.getBoundingClientRect();
      cnt += 1;
    }
  }
}

customElements.define('ballfield-entry', BallFieldEntry);
