import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getAdditionSubstractionWithinDecadeGameVariant } from './AdditionSubstractionWithinDecadeGameVariants';
import '../NumberedKite';

@customElement('addition-substraction-within-decade-game-icon')
export class AdditionSubstractionWithinDecadeGameIcon extends LitElement {
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
    const variantInfo = getAdditionSubstractionWithinDecadeGameVariant(
      this.variant,
    );
    const { text1, text2 } = variantInfo.exampleSums;

    const stringsToShow = [text1, text2].filter(s => s !== '');

    let fontSizeFactor = 1;

    if (stringsToShow.length === 0) {
      stringsToShow.push('');
    } else if (stringsToShow.length === 1) {
      if (stringsToShow[0].length <= 3) {
        fontSizeFactor = 0.7;
      } else if (stringsToShow[0].length <= 4) {
        fontSizeFactor = 0.6;
      } else {
        fontSizeFactor = 0.5;
      }
    } else if (stringsToShow.length === 2) {
      if (stringsToShow[0].length <= 3 && stringsToShow[1].length <= 3) {
        fontSizeFactor = 0.62;
      } else if (stringsToShow[0].length <= 4 && stringsToShow[1].length <= 4) {
        fontSizeFactor = 0.56;
      } else {
        fontSizeFactor = 0.55;
      }
    }

    return html`
      <numbered-kite
        .color=${variantInfo.iconColor}
        .stringsToShow=${stringsToShow}
        .tailLength=${'short'}
        .disabled=${false}
        .fontSizeFactor=${fontSizeFactor}
      ></numbered-kite>
    `;
  }
}
