import { html, css } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultGroup, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame } from './TimeLimitedGame';

import {
  randomFromSet,
  randomFromSetAndSplice,
  randomIntFromRange,
} from './Randomizer';
import './AscendingBalloons';
import type { Answers, AscendingBalloons } from './AscendingBalloons';
import { GameLogger } from './GameLogger';

import { DragAndDropCoordinator } from './DragAndDropCoordinator';
import type { Draggable } from './DragAndDropCoordinator';

import './DraggableElement';

@customElement('sorting-game-app')
export class SortingGameApp extends TimeLimitedGame {
  @state()
  private numbers = [1, 2, 3, 4];
  @state()
  private gameElementsDisabled = true;

  private gameLogger = new GameLogger('B', '');

  private dragDisabled = false;
  private mouseDrag = true;
  private cummulativeDeltaX = 0;
  private cummulativeDeltaY = 0;

  private dragAndDropCoordinator = new DragAndDropCoordinator();

  constructor() {
    super();
    this.welcomeDialogImageUrl = 'images/Mompitz Elli star-yellow.png';
    this.parseUrl();
  }

  private parseUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    /*
    const operatorsFromUrl = urlParams.getAll('operator');
    operatorsFromUrl.forEach(operator => {
      if (operator === 'plus' && !this.operators.find(value => value === '+'))
        this.operators.push('+');
      else if (
        operator === 'minus' &&
        !this.operators.find(value => value === '-')
      )
        this.operators.push('-');
    });
    if (this.operators.length === 0) this.operators.push('+');

    if (this.operators.length === 2) {
      this.gameLogger.setSubCode('c');
    } else if (this.operators[0] === '+') {
      this.gameLogger.setSubCode('a');
    } else if (this.operators[1] === '-') {
      this.gameLogger.setSubCode('b');
    }
*/
  }

  /** Get all static styles */
  static get styles(): CSSResultGroup {
    return css`
      .numbersAndBoxes {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 80vh;
      }

      .numbers,
      .boxes {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
      }

      @media (min-aspect-ratio: 2/3) {
        .number {
          display: block;
          width: auto;
          height: 18vh;
        }

        .boxSmallest {
          display: block;
          width: auto;
          height: 12vh;
        }

        .boxSmall {
          display: block;
          width: auto;
          height: 25vh;
        }

        .boxBig {
          display: block;
          width: auto;
          height: 35vh;
        }

        .boxBiggest {
          display: block;
          width: auto;
          height: 45vh;
        }
      }

      @media (max-aspect-ratio: 2/3) {
        .number {
          display: block;
          width: 10vw;
          height: auto;
        }

        .boxSmallest {
          display: block;
          width: 8vw;
          height: auto;
        }

        .boxSmall {
          display: block;
          width: 12vw;
          height: auto;
        }

        .boxBig {
          display: block;
          width: 16vw;
          height: auto;
        }

        .boxBiggest {
          display: block;
          width: 20vw;
          height: auto;
        }
      }
    `;
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    // await this.ascendingBalloons.updateComplete;
    return result;
  }

  /** Start a new game.
   * Progress bar and counters are automatically reset.
   */
  startNewGame(): void {
    window.scrollTo(0, 1);
    this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>
      Gooi het kleinste getal in de kleinste doos en het grootste getal in de
      grootste doos
    </p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Sorteer de getallen`;
  }

  private handleCorrectAnswer(): void {
    this.numberOk += 1;
    this.newRound();
  }

  private handleWrongAnswer(): void {
    this.numberNok += 1;
  }

  private newRound() {
    this.gameElementsDisabled = false;
  }

  executeGameOverActions(): void {
    this.gameElementsDisabled = true;
    fetch('asdflog.php?game=D', {
      method: 'POST',
    });
  }

  async firstUpdated(): Promise<void> {
    await this.getUpdateComplete();

    const numberElements: NodeListOf<Draggable> =
      this.getElement<HTMLElement>('#numbersContainer').querySelectorAll(
        'draggable-element'
      );

    numberElements.forEach(element => {
      this.dragAndDropCoordinator.addDraggable(element.id, element);
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

  mouseUp(): void {
    this.mouseDrag = false;
  }

  /** Render the application */
  render(): HTMLTemplateResult {
    return html`
      ${this.renderTimedGameApp()}
      <div class="numbersAndBoxes">
        <div class="numbers" id="numbersContainer">
          <draggable-element
            id="number1" >
            <img 
              draggable="false" 
              alt="number 1" 
              class="number" 
              src="images/Mompitz4.png"
            />
          </draggable-element>
          <draggable-element
            id="number2" >
            <img 
              draggable="false" 
              alt="number 2" 
              class="number" 
              src="images/Mompitz7.png"
            />
          </draggable-element>
          <draggable-element
            id="number3">
            <img 
              draggable="false" 
              alt="number 3" 
              class="number" 
              src="images/Mompitz5.png"
            />
          </draggable-element>
          <draggable-element
            id="number4">
            <img 
              draggable="false" 
              alt="number 4" 
              class="number" 
              src="images/Mompitz8.png"
            />
          </draggable-element>

        </div>
        <div class="boxes">
          <img draggable="false" alt="smallest box" class="boxSmallest" src="images/red-box.png"></img>
          <img draggable="false" alt="small box" class="boxSmall" src="images/red-box.png"></img>
          <img draggable="false" alt="big box" class="boxBig" src="images/red-box.png"></img>
          <img draggable="false" alt="biggest box" class="boxBiggest" src="images/red-box.png"></img>
        </div>
      </div>
    `;
  }
}
