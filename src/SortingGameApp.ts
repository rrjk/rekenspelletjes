import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';

import type { DropTargetBox } from './DropTargetBox';
import './DropTargetBox';

import { randomIntFromRange } from './Randomizer';
import './AscendingBalloons';
import { GameLogger } from './GameLogger';

import type { DraggableElement, DropEvent } from './DraggableElement';
import './DraggableElement';

import './MompitzNumber';

import './RealHeight';

type BoxSize = 'Smallest' | 'Small' | 'Big' | 'Biggest';

type NumberInformation = {
  id: string;
  visible: boolean;
  value: number;
};

type BoxInformation = {
  id: string;
  numberVisible: boolean;
  intendedValue: number;
  size: BoxSize;
};

@customElement('sorting-game-app')
export class SortingGameApp extends TimeLimitedGame2 {
  private static boxSizes: Map<number, BoxSize[]> = new Map<number, BoxSize[]>([
    [4, ['Smallest', 'Small', 'Big', 'Biggest']],
    [3, ['Small', 'Big', 'Biggest']],
    [2, ['Small', 'Biggest']],
  ]);

  @state()
  private boxColor = 'red';

  @state()
  private numbers: NumberInformation[] = [];

  @state()
  private boxes: BoxInformation[] = [];

  private minimumValue = 1;
  private maximumValue = 10;

  @state()
  private maxNumberDigits = 1.5;

  private gameLogger = new GameLogger('E', 'a');

  private numberCorrectDrag = 0;

  private getNumber(query: string): DraggableElement {
    return this.getElement<DraggableElement>(query);
  }

  private getBox(query: string): DropTargetBox {
    return this.getElement<DropTargetBox>(query);
  }

  constructor() {
    super();
    this.welcomeDialogImageUrl = new URL(
      '../images/Mompitz7.png',
      import.meta.url
    );
    this.parseUrl();
  }

  protected parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    let numberBoxes = 4;
    if (urlParams.has('numberBoxes')) {
      numberBoxes = parseInt(urlParams.get('numberBoxes') || '', 10);
      if (!numberBoxes || numberBoxes < 2 || numberBoxes > 4) {
        numberBoxes = 4;
      }
    }
    for (let i = 0; i < numberBoxes; i++) {
      this.numbers.push({ id: `number${i}`, visible: false, value: i });

      this.boxes.push({
        id: `box${i}`,
        numberVisible: false,
        intendedValue: i,
        size: SortingGameApp.boxSizes.get(numberBoxes)?.[i] ?? 'Smallest',
      });
    }

    if (urlParams.has('minimumValue')) {
      this.minimumValue = parseInt(urlParams.get('minimumValue') ?? '', 10);
      if (Number.isNaN(this.minimumValue)) this.minimumValue = 1;
    }

    if (urlParams.has('maximumValue')) {
      this.maximumValue = parseInt(urlParams.get('maximumValue') ?? '', 10);
      if (Number.isNaN(this.maximumValue)) this.maximumValue = 10;
    }

    if (this.minimumValue + 5 >= this.maximumValue)
      this.maximumValue = this.minimumValue + 5;

    if (this.maximumValue < 10) this.maxNumberDigits = 1;
    else if (this.maximumValue === 10) this.maxNumberDigits = 1.5;
    else if (this.maximumValue < 100) this.maxNumberDigits = 2;
    else if (this.maximumValue === 100) this.maxNumberDigits = 2.5;
    else if (this.maximumValue < 1000) this.maxNumberDigits = 3;
    else if (this.maximumValue === 1000) this.maxNumberDigits = 3.5;

    this.boxColor = 'red';
    if (urlParams.has('boxColor')) {
      if (urlParams.get('boxColor') === 'blue') {
        this.boxColor = 'blue';
      }
    }
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .hidden {
          visibility: hidden;
        }
        .numbersAndBoxes {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          height: calc(100 * var(--vh));
          width: calc(100 * var(--vw));
        }

        .numbers,
        .boxes {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          width: 100%;
        }

        .number {
          display: inline-block;
          width: calc(80 / var(--numberNumbers) * var(--vw));
          height: calc(30 * var(--vh));
        }

        .box {
          display: inline-block;
          width: calc(80 / var(--numberNumbers) * var(--vw));
          height: calc(60 * var(--vh));
        }
      `,
    ];
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();

    const promises = [];
    for (const number of this.numbers) {
      promises.push(this.getNumber(`#${number.id}`).updateComplete);
    }
    for (const box of this.boxes) {
      promises.push(this.getBox(`#${box.id}`).updateComplete);
    }

    await Promise.all(promises);
    return result;
  }

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>
      Verplaats het kleinste getal naar de kleinste doos en het grootste getal
      naar de grootste doos
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Sorteer de getallen`;
  }

  private handleCorrectDrag(): void {
    this.numberCorrectDrag += 1;
    if (this.numberCorrectDrag === this.numbers.length)
      this.handleCorrectAnswer();
  }

  private handleCorrectAnswer(): void {
    this.numberOk += 1;
    this.newRound();
  }

  private handleWrongAnswer(): void {
    this.numberNok += 1;
  }

  private newRound() {
    this.numberCorrectDrag = 0;
    for (const box of this.boxes) {
      box.numberVisible = false;
    }

    const newValues: number[] = [];
    while (newValues.length !== this.numbers.length) {
      const proposedValue = randomIntFromRange(
        this.minimumValue,
        this.maximumValue
      );
      if (newValues.find(value => value === proposedValue) === undefined)
        newValues.push(proposedValue);
    }

    this.numbers.forEach((number, index) => {
      number.value = newValues[index];
      this.getNumber(`#${number.id}`).resetDrag();
      this.getNumber(`#${number.id}`).markAllTargetsAsDropOk();
      number.visible = true;
    });

    newValues.sort((a, b) => a - b);

    this.boxes.forEach((box, index) => {
      box.intendedValue = newValues[index];
      box.numberVisible = false;
    });

    this.requestUpdate();
  }

  executeGameOverActions(): void {
    this.gameLogger.logGameOver();
  }

  async firstUpdated(): Promise<void> {
    await this.getUpdateComplete();

    // Add all boxes as targets to all draggable numbers;
    this.renderRoot.querySelectorAll('.draggableNumber').forEach(draggable => {
      this.renderRoot
        .querySelectorAll('drop-target-box')
        .forEach(dropTarget => {
          (<DraggableElement>draggable).addDropElement(
            <DropTargetBox>dropTarget
          );
        });

      draggable.addEventListener('dropped', event =>
        this.handleDropped(<DropEvent>event)
      );
    });

    /* Workaround for bug found in firefox where draggable=false is ignored in case user-select is set to none.
     * Please note that this expression cannot pierce into webcomponent's shadowroms.
     * The img in slots are found though.
     */
    if (window.navigator.userAgent.toLowerCase().includes('firefox')) {
      this.renderRoot.querySelectorAll('img[draggable=false]').forEach(el => {
        el.addEventListener('mousedown', event => event.preventDefault());
      });
    }

    return super.firstUpdated();
  }

  handleDropped(evt: DropEvent) {
    const number = this.numbers.find(elt => elt.id === evt.draggableId);
    if (number !== undefined) {
      const box = this.boxes.find(elt => elt.id === evt.dropTargetId);
      if (box !== undefined) {
        if (number.value === box.intendedValue) {
          number.visible = false;
          box.numberVisible = true;
          // Mark this target as a wrong drop target for all numbers
          for (const numberToMark of this.numbers) {
            this.getNumber(`#${numberToMark.id}`).markAsWrongDrop(
              this.getBox(`#${evt.dropTargetId}`)
            );
          }
          this.handleCorrectDrag();
          // The content of this.numbers and this.boxes has changed, but the variables have not been assigned a different object, so we need to manually request an update
          this.requestUpdate();
        } else if (evt.dropType === 'dropOk') {
          this.handleWrongAnswer();
          this.getNumber(`#${number.id}`).resetDrag();
          // A wrong drop was done, this target is marked as a wrong drop to prevent repeated wrong drops.
          this.getNumber(`#${number.id}`).markAsWrongDrop(
            this.getBox(`#${evt.dropTargetId}`)
          );
        } else {
          this.getNumber(`#${number.id}`).resetDrag();
        }
      }
    }
  }

  /** Render the application */
  renderGameContent(): HTMLTemplateResult {
    return html`
      <style>
        :host {
          --numberNumbers: ${this.numbers.length};
        }
      </style>

      <div class="numbersAndBoxes">
        <div class="numbers" id="numbersContainer">
          ${this.numbers.map(
            elt =>
              html` <draggable-element
                class="draggableNumber ${elt.visible === false ? 'hidden' : ''}"
                id="${elt.id}"
              >
                <mompitz-number
                  number="${elt.value}"
                  minimumNumberDigitsForSize="${this.maxNumberDigits}"
                  class="number"
                ></mompitz-number>
              </draggable-element>`
          )}
        </div>

        <div class="boxes">
          ${this.boxes.map(
            elt => html`<drop-target-box
              class="box"
              id="${elt.id}"
              size="${elt.size}"
              boxColor="${this.boxColor}"
            >
              <mompitz-number
                number="${elt.intendedValue}"
                class="number ${elt.numberVisible === false ? 'hidden' : ''}"
                minimumNumberDigitsForSize="${this.maxNumberDigits}"
              ></mompitz-number>
            </drop-target-box>`
          )}
        </div>
      </div>
    `;
  }
}
