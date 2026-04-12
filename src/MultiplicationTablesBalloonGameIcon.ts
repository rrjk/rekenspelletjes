import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  ExtendedVariantInfo,
  getGameVariant,
} from './MultiplicationTablesBalloonGameVariants';

import { UnexpectedValueError } from './UnexpectedValueError';

import './NumberedBalloon';

@customElement('multiplication-tables-balloon-game-icon')
export class MultiplicationTablesBalloonGameIcon extends LitElement {
  /** What time to use for the hourglass */
  @property({ type: String })
  accessor variant = 'a';
  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: grid;
        justify-items: center;
        align-items: center;
        container-type: size;
      }

      numbered-balloon {
        aspect-ratio: 8 / 11;
      }

      @container (aspect-ratio > 8/11) {
        numbered-balloon {
          height: 100cqh;
        }
      }
      @container (aspect-ratio <= 8/11) {
        numbered-balloon {
          width: 100cqw;
        }
      }
    `;
  }

  renderBalloon(variantInfo: ExtendedVariantInfo): HTMLTemplateResult {
    let stringsToShow: string[] = [];
    let fontSizeFactor = 1;
    if (typeof variantInfo.tableSet === 'number') {
      stringsToShow = [`×${variantInfo.tableSet}`];
      if (variantInfo.tableSet === 10) fontSizeFactor = 0.7;
      else fontSizeFactor = 0.8;
    } else {
      switch (variantInfo.tableSet) {
        case 'firstHalf':
          stringsToShow = [`×`, '2 3 4', '5 10'];
          fontSizeFactor = 0.45;
          break;
        case '2-10':
          stringsToShow = [`×`, '2 3 4 5', '6 7 8', '9 10'];
          fontSizeFactor = 0.35;
          break;
        case '11-14':
        case '11-19':
        case 'tens':
          throw new Error(
            `Internal SW Error, tableSet ${variantInfo.tableSet} should not be possible for balloon variants`,
          );
          break;
        default:
          throw new UnexpectedValueError(variantInfo.tableSet);
      }
    }

    return html` <numbered-balloon
      .color=${variantInfo.iconColor}
      .stringsToShow=${stringsToShow}
      ropeLength="short"
      .fontSizeFactor=${fontSizeFactor}
    ></numbered-balloon>`;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getGameVariant(this.variant);
    switch (variantInfo.image) {
      case 'balloon':
        return this.renderBalloon(variantInfo);
      default:
        return html`<img src="default.png" alt="Default" />`;
    }
  }
}
