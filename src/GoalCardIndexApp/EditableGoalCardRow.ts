import { css, CSSResultArray, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type Entry } from './SectionInfoType';
import { convertJSON } from '../Utils';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';
import { GameInfo } from '../URLshortener2';
import './EditableGameIcon';
import { renderPlusIcon } from '../Icons';
import { nextVariant, previousVariant } from '../VariantUtils';

type PlusPosition = 'left' | 'right';

/** Editable goal card row
 * @event games-changed  - Fired when the rows changes
 */
@customElement('editable-goalcard-row')
export class EditableGoalCardRow extends LitElement {
  /** Entries for the row */
  @property({ type: Array, converter: convertJSON<Entry[]> })
  accessor games: GameInfo[] = [];

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          position: relative;
          display: grid;
          row-gap: 10px;
          column-gap: 10px;
          grid-template-columns: repeat(4, 1fr);
          justify-content: space-around;
          justify-items: center;
          align-items: center;
          width: min(400px, 90vw);
        }

        .centeredGameIcon {
          width: 100%;
          grid-column-start: 2;
          grid-column-end: span 2;
        }

        .leftGameIcon {
          width: 100%;
          grid-column-start: 1;
          grid-column-end: span 2;
        }

        .rightGameIcon {
          width: 100%;
          grid-column-start: 3;
          grid-column-end: span 2;
        }

        button {
          aspect-ratio: 1;
          width: 30%;
          min-height: 0;
          margin: 0;
          padding: 0;
        }

        #plusleft {
          grid-column-start: 1;
          grid-column-end: span 1;
        }

        #plusright {
          grid-column-start: 4;
          grid-column-end: span 1;
        }

        svg {
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  onDelete(index: number) {
    if (this.games.length === 1) {
      this.dispatchEvent(new Event('row-deleted'));
      return;
    }

    const updatedGames = [
      ...this.games.slice(0, index),
      ...this.games.slice(index + 1, this.games.length),
    ];

    this.dispatchEvent(
      new CustomEvent<GameInfo[]>('games-changed', {
        detail: updatedGames,
      }),
    );
  }

  onGameChanged(index: number, updatedGameInfo: GameInfo) {
    const updatedGames = [
      ...this.games.slice(0, index),
      updatedGameInfo,
      ...this.games.slice(index + 1, this.games.length),
    ];
    this.dispatchEvent(
      new CustomEvent<GameInfo[]>('games-changed', {
        detail: updatedGames,
      }),
    );
  }

  onPlus(position: PlusPosition) {
    if (this.games.length !== 1) throw new Error('Internal SW error');
    const newGame: GameInfo = {
      game: this.games[0].game,
      variant:
        position === 'left'
          ? previousVariant(this.games[0].variant)
          : nextVariant(this.games[0].variant),
      timeCode: this.games[0].timeCode,
    };
    let updatedGames: GameInfo[] = [];
    if (position === 'left') updatedGames = [newGame, ...this.games];
    else updatedGames = [...this.games, newGame];
    this.dispatchEvent(
      new CustomEvent<GameInfo[]>('games-changed', {
        detail: updatedGames,
      }),
    );
  }

  renderEditableGameIcon(
    index: number,
    position: 'left' | 'right' | 'center' = 'center',
  ): HTMLTemplateResult {
    const classes: ClassInfo = {
      leftGameIcon: position === 'left',
      rightGameIcon: position === 'right',
      centeredGameIcon: position === 'center',
    };
    if (index >= this.games.length) throw new Error('Internal SW error');
    return html`
      <editable-game-icon
        class=${classMap(classes)}
        .gameInfo=${this.games[index]}
        @game-changed=${(e: CustomEvent<GameInfo>) =>
          this.onGameChanged(index, e.detail)}
        @icon-deleted=${() => this.onDelete(index)}
      ></editable-game-icon>
    `;
  }

  renderPlus(position: PlusPosition) {
    return html`
      <button id="plus${position}" @click=${() => this.onPlus(position)}>
        ${renderPlusIcon()}
      </button>
    `;
  }

  render(): HTMLTemplateResult {
    if (this.games.length === 2) {
      return html`
        ${this.renderEditableGameIcon(0, 'left')}
        ${this.renderEditableGameIcon(1, 'right')}
      `;
    }
    if (this.games.length === 1) {
      return html`${this.renderPlus('left')}
      ${this.renderEditableGameIcon(0, 'center')} ${this.renderPlus('right')}`;
    }
    throw new Error(
      'Unsupported number of entries in row: ' + this.games.length,
    );
  }
}
