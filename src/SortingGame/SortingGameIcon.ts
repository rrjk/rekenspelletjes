import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  getSortingGameVariant,
  type SortingGameExtendedVariantInfo,
} from './SortingGameVariants';

@customElement('sorting-game-icon')
export class SortingGameIcon extends LitElement {
  @property({ type: String })
  accessor variant = '';

  @property({ type: Boolean })
  accessor isGeneric = false;

  // Aspect ratios for different icon types
  static aspectRatioGeneric = 674 / 671; // For generic colored box icons
  static aspectRatioDetailed = 244 / 306; // For all detailed box images

  static get styles(): CSSResultGroup {
    return css`
      :host {
        aspect-ratio: var(
          --aspect-ratio,
          ${SortingGameIcon.aspectRatioDetailed}
        );
        min-width: 0;
        min-height: 0;
        container-type: size;
        display: grid;
        justify-items: center;
        align-items: center;
        position: relative;
      }

      .boxImage {
        object-fit: contain;
      }

      @container (aspect-ratio < ${SortingGameIcon.aspectRatioGeneric}) {
        .boxImage.generic {
          width: 100cqw;
        }
      }

      @container (aspect-ratio >= ${SortingGameIcon.aspectRatioGeneric}) {
        .boxImage.generic {
          height: 100cqh;
        }
      }

      @container (aspect-ratio < ${SortingGameIcon.aspectRatioDetailed}) {
        .boxImage.detailed {
          width: 100cqw;
        }
      }

      @container (aspect-ratio >= ${SortingGameIcon.aspectRatioDetailed}) {
        .boxImage.detailed {
          height: 100cqh;
        }
      }
    `;
  }

  private getGenericBoxImage(boxColor: string): string {
    switch (boxColor) {
      case 'red':
        return new URL('../../images/red-box.png', import.meta.url).href;
      case 'blue':
        return new URL('../../images/blue-box.png', import.meta.url).href;
      case 'purple':
        return new URL('../../images/purple-box.png', import.meta.url).href;
      default:
        return new URL('../../images/red-box.png', import.meta.url).href;
    }
  }

  private getDetailedBoxImage(
    variantInfo: SortingGameExtendedVariantInfo,
  ): string {
    const { numberBoxes, maximumValue, divider } = variantInfo;

    if (divider !== 1) {
      // Decimal numbers use special images
      if (divider === 10)
        return new URL('../../images/4BoxesTill10Div10.png', import.meta.url)
          .href;
      if (divider === 100)
        return new URL('../../images/4BoxesTill100Div100.png', import.meta.url)
          .href;
      if (divider === 1000)
        return new URL(
          '../../images/4BoxesTill1000Div1000.png',
          import.meta.url,
        ).href;
    } else {
      // Regular numbers use standard box images
      if (maximumValue <= 10) {
        if (numberBoxes === 2)
          return new URL('../../images/2BoxesTill10.png', import.meta.url).href;
        if (numberBoxes === 3)
          return new URL('../../images/3BoxesTill10.png', import.meta.url).href;
        if (numberBoxes === 4)
          return new URL('../../images/4BoxesTill10.png', import.meta.url).href;
      } else if (maximumValue <= 20) {
        if (numberBoxes === 2)
          return new URL('../../images/2BoxesTill20.png', import.meta.url).href;
        if (numberBoxes === 3)
          return new URL('../../images/3BoxesTill20.png', import.meta.url).href;
        if (numberBoxes === 4)
          return new URL('../../images/4BoxesTill20.png', import.meta.url).href;
      } else if (maximumValue <= 30) {
        if (numberBoxes === 2)
          return new URL('../../images/2BoxesTill30.png', import.meta.url).href;
        if (numberBoxes === 3)
          return new URL('../../images/3BoxesTill30.png', import.meta.url).href;
        if (numberBoxes === 4)
          return new URL('../../images/4BoxesTill30.png', import.meta.url).href;
      } else if (maximumValue <= 50) {
        if (numberBoxes === 2)
          return new URL('../../images/2BoxesTill50.png', import.meta.url).href;
        if (numberBoxes === 3)
          return new URL('../../images/3BoxesTill50.png', import.meta.url).href;
        if (numberBoxes === 4)
          return new URL('../../images/4BoxesTill50.png', import.meta.url).href;
      } else if (maximumValue <= 100) {
        if (numberBoxes === 2)
          return new URL('../../images/2BoxesTill100.png', import.meta.url)
            .href;
        if (numberBoxes === 3)
          return new URL('../../images/3BoxesTill100.png', import.meta.url)
            .href;
        if (numberBoxes === 4)
          return new URL('../../images/4BoxesTill100.png', import.meta.url)
            .href;
      } else if (maximumValue <= 1000) {
        return new URL('../../images/4BoxesTill999.png', import.meta.url).href;
      } else if (maximumValue <= 10000) {
        return new URL('../../images/4BoxesTill9999.png', import.meta.url).href;
      }
    }

    // Fallback to 4BoxesTill10.png
    return new URL('../../images/4BoxesTill10.png', import.meta.url).href;
  }

  private renderGenericIcon(
    variantInfo: SortingGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    const imageUrl = this.getGenericBoxImage(variantInfo.boxColor);
    return html`
      <style>
        :root {
          --aspect-ratio: ${SortingGameIcon.aspectRatioGeneric};
        }
      </style>
      <img
        src=${imageUrl}
        alt="Generic ${variantInfo.boxColor} sorting box"
        class="boxImage generic"
      />
    `;
  }

  private renderDetailedIcon(
    variantInfo: SortingGameExtendedVariantInfo,
  ): HTMLTemplateResult {
    const imageUrl = this.getDetailedBoxImage(variantInfo);
    return html`
      <style>
        :root {
          --aspect-ratio: ${SortingGameIcon.aspectRatioDetailed};
        }
      </style>
      <img
        src=${imageUrl}
        alt="Sorting game with ${variantInfo.numberBoxes} boxes"
        class="boxImage detailed"
      />
    `;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getSortingGameVariant(this.variant);

    if (this.isGeneric) {
      return this.renderGenericIcon(variantInfo);
    } else {
      return this.renderDetailedIcon(variantInfo);
    }
  }
}
