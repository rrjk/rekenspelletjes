import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getAdditionSubstractionWithinDecadeGameVariant } from './AdditionSubstractionWithinDecadeGameVariants';
import '../NumberedKite';
import { Color } from '../Colors';

@customElement('addition-substraction-within-decade-game-icon')
export class AdditionSubstractionWithinDecadeGameIcon extends LitElement {
  /**
   * Game variant code (e.g., 'aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc').
   * Determines the icon color, decades, and operators for the addition/subtraction game.
   * Empty string shows default '+' and '−' symbols.
   */
  @property({ type: String })
  accessor variant = '';

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        container-type: size;
      }

      numbered-kite {
        width: 100%;
        height: 100%;
      }
    `;
  }

  render(): HTMLTemplateResult {
    let stringsToShow: string[] = [];
    let iconColor: Color = 'green';

    if (this.variant === '') {
      stringsToShow = ['+', '−'];
      iconColor = 'green';
    } else {
      const variantInfo = getAdditionSubstractionWithinDecadeGameVariant(
        this.variant,
      );
      const { text1, text2 } = variantInfo.exampleSums;

      stringsToShow = [text1, text2].filter(s => s !== '');
      iconColor = variantInfo.iconColor;
    }

    let fontSizeFactor = 1;

    if (stringsToShow.length === 1) {
      if (stringsToShow[0].length <= 2) {
        fontSizeFactor = 0.9;
      } else if (stringsToShow[0].length <= 3) {
        fontSizeFactor = 0.7;
      } else if (stringsToShow[0].length <= 4) {
        fontSizeFactor = 0.6;
      } else {
        fontSizeFactor = 0.5;
      }
    } else if (stringsToShow.length === 2) {
      if (stringsToShow[0].length <= 2 && stringsToShow[1].length <= 2) {
        fontSizeFactor = 0.9;
      } else if (stringsToShow[0].length <= 3 && stringsToShow[1].length <= 3) {
        fontSizeFactor = 0.62;
      } else if (stringsToShow[0].length <= 4 && stringsToShow[1].length <= 4) {
        fontSizeFactor = 0.56;
      } else {
        fontSizeFactor = 0.55;
      }
    }

    return html`
      <numbered-kite
        .color=${iconColor}
        .stringsToShow=${stringsToShow}
        .tailLength=${'short'}
        .disabled=${false}
        .fontSizeFactor=${fontSizeFactor}
      ></numbered-kite>
    `;
  }
}
