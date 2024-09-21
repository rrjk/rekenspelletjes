import { html, css } from 'lit';

// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { TimeLimitedGame2 } from './TimeLimitedGame2';
import { GameLogger } from './GameLogger';

import './DigitKeyboard';
import './TensSplitWidget';

@customElement('tens-split-app')
export class TensSplitApp extends TimeLimitedGame2 {
  private gameLogger = new GameLogger('W', 'a');

  /** Start a new game.
   */
  startNewGame(): void {
    super.startNewGame();
    // this.newRound();
  }

  /** Get the text to show in the game over dialog */
  get welcomeMessage(): HTMLTemplateResult {
    return html`<p>Splits het getal in tientallen en eenheden.</p>`;
  }

  /** Get the title for the welcome dialog. */
  get welcomeDialogTitle(): string {
    return `Tiental afsplitsen`;
  }

  static get styles(): CSSResultArray {
    return [
      ...super.styles,
      css`
        .gameContent {
          display: grid;
          grid-template-rows: 0 repeat(2, calc(98% / 2)) 0;
          row-gap: 1%;
        }
      `,
    ];
  }

  // DummyRows are added to get a gap on the top and the bottom.

  renderGameContent(): HTMLTemplateResult {
    return html` <div class="dummyRow"></div>
      <tens-split-widget numberToSplit="56"></tens-split-widget>
      <digit-keyboard></digit-keyboard>
      <div class="dummyRow"></div>`;
  }
}
