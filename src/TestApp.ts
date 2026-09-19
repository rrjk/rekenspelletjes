import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement, state } from 'lit/decorators.js';

import './GoalCardIndexApp/EditableText';
import { type ValueChangedEvent } from './GoalCardIndexApp/EditableText';
import './GoalCardIndexApp/EditableGoalCardRow';
import './GoalCardIndexApp/EditableGameIcon';
import { GameInfo } from './URLshortener2';

@customElement('test-app')
export class TestApp extends LitElement {
  @state()
  accessor value = 'Ronald';

  @state()
  accessor gameInfo: GameInfo = { game: 'A', variant: 'aa', timeCode: 'a' };

  static get styles(): CSSResultArray {
    return [
      css`
        editable-game-icon-card {
          width: 200px;
        }
        editable-text {
          --font-size: 70px;
          --font-weight: bold;
        }
      `,
    ];
  }

  valueChanged(e: ValueChangedEvent) {
    this.value = e.value;
  }

  handleIconDeleted() {
    console.warn(`Icon deleted`);
  }

  handleGameChanged(e: CustomEvent<GameInfo>) {
    this.gameInfo = e.detail;
  }

  protected renderTest(): HTMLTemplateResult {
    return html`
      <editable-game-icon-card
        .gameInfo=${this.gameInfo}
        @icon-deleted=${() => this.handleIconDeleted()}
        @game-changed=${(e: CustomEvent<GameInfo>) => this.handleGameChanged(e)}
      ></editable-game-icon-card>
      <h2>Piet</h2>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
