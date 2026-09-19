import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, state } from 'lit/decorators.js';

import './GoalCardIndexApp/EditableText';
import './GoalCardIndexApp/EditableGoalCardRow';
import './GoalCardIndexApp/EditableGameIcon';
import { GameInfo } from './URLshortener2';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor gameInfo: GameInfo[] = [
    { game: 'A', variant: 'aa', timeCode: 'a' },
    { game: 'A', variant: 'ab', timeCode: 'a' },
  ];

  static get styles(): CSSResultArray {
    return [css``];
  }

  onGamesChanged(updatedGames: GameInfo[]) {
    this.gameInfo = updatedGames;
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <editable-goalcard-row
        .games=${this.gameInfo}
        @games-changed=${(e: CustomEvent<GameInfo[]>) =>
          this.onGamesChanged(e.detail)}
        @row-deleted=${() => {
          console.warn('row-deleted');
        }}
      ></editable-goalcard-row>
      <h2>Piet</h2>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
