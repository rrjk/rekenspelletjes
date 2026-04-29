import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  FractionsPairMatchingGameExtendedVariantInfo,
  getFractionsPairMatchingGameVariant,
} from './FractionsPairMatchingGameVariants';
import { UnexpectedValueError } from '../UnexpectedValueError';
import { getColorInfo } from '../Colors';
import { Fraction, FractionRepresentation } from '../Fraction';
import '../FractionElement';

@customElement('fractions-pair-matching-game-icon')
export class FractionsPairMatchingGameIcon extends LitElement {
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

      .iconContainer {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 100%;
        width: 90%;
        height: 90%;
        min-width: 0;
        min-height: 0;
        border-radius: 25%;
        border: 2px solid black;
        background-color: var(--fill-color);
        justify-items: center;
        align-items: center;
      }

      .iconContent {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 47% 47%;
        justify-items: center;
        align-items: center;
        gap: 5%;
      }
    `;
  }

  private renderIconContent(
    variantInfo: FractionsPairMatchingGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    let leftRepresentation: FractionRepresentation = 'fraction';
    let leftFraction: Fraction = new Fraction();
    let rightRepresentation: FractionRepresentation = 'piechart';
    let rightFraction: Fraction = new Fraction();

    switch (variantInfo.gameType) {
      case 'equalFractions':
        leftRepresentation = 'fraction';
        leftFraction = new Fraction(3, 4);
        rightRepresentation = 'fraction';
        rightFraction = new Fraction(6, 8);
        break;
      case 'fractionToDecimal':
        leftRepresentation = 'fraction';
        leftFraction = new Fraction(3, 5);
        rightRepresentation = 'decimal';
        rightFraction = new Fraction(3, 5);
        break;
      case 'fractionToPercentage':
        leftRepresentation = 'fraction';
        leftFraction = new Fraction(7, 10);
        rightRepresentation = 'percentage';
        rightFraction = new Fraction(7, 10);
        break;
      case 'fractionToPie':
        leftRepresentation = 'fraction';
        leftFraction = new Fraction(2, 3);
        rightRepresentation = 'piechart';
        rightFraction = new Fraction(2, 3);
        break;
      case 'percentageToDecimal':
        leftRepresentation = 'percentage';
        leftFraction = new Fraction(1, 4);
        rightRepresentation = 'decimal';
        rightFraction = new Fraction(1, 4);
        break;
      case 'percentageToPie':
        leftRepresentation = 'percentage';
        leftFraction = new Fraction(2, 5);
        rightRepresentation = 'piechart';
        rightFraction = new Fraction(2, 5);
        break;
      default:
        throw new UnexpectedValueError(variantInfo.gameType);
    }

    return html`
      <fraction-element
        .fraction=${leftFraction}
        .representation=${leftRepresentation}
      ></fraction-element>
      <fraction-element
        .fraction=${rightFraction}
        .representation=${rightRepresentation}
      ></fraction-element>
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getFractionsPairMatchingGameVariant(this.variant);
    const colorInfo = getColorInfo(variantInfo.iconColor);

    return html`
      <div
        class="iconContainer"
        style="--fill-color: ${colorInfo.mainColorCode}"
      >
        <div class="iconContent">${this.renderIconContent(variantInfo)}</div>
      </div>
    `;
  }
}
