import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  ExtendedVariantInfo,
  getGameVariant,
} from './MultiplicationTablesBalloonGameVariants';

import { UnexpectedValueError } from './UnexpectedValueError';

import './NumberedBalloon';
import './RocketImageV2';
import './ZeppelinImageV2';
import './FlyingSaucer';
import { operatorToSymbol } from './Operator';

@customElement('multiplication-tables-balloon-game-icon')
export class MultiplicationTablesBalloonGameIcon extends LitElement {
  /** Gamevariant */
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

      numbered-balloon,
      rocket-image,
      zeppelin-image,
      flying-saucer {
        width: 100%;
        height: 100%;
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

  renderZeppelin(variantInfo: ExtendedVariantInfo): HTMLTemplateResult {
    /* The zeppelin variant is only used for the multiplication variant, 
       so we'll use the times operator
    */
    let stringToShow = '';

    let fontSizeFactor = 1;

    if (typeof variantInfo.tableSet === 'number') {
      stringToShow = `${operatorToSymbol('times')}${variantInfo.tableSet}`;
    } else {
      switch (variantInfo.tableSet) {
        case 'firstHalf':
        case '2-10':
          throw new Error(
            `Internal SW Error, tableSet ${variantInfo.tableSet} should not be possible for zeppelin variants`,
          );
          break;
        case '11-14':
          stringToShow = `${operatorToSymbol('times')} 11-14`;
          fontSizeFactor = 0.8;
          break;
        case '11-19':
          stringToShow = `${operatorToSymbol('times')} 11-19`;
          fontSizeFactor = 0.8;
          break;
        case 'tens':
          stringToShow = `${operatorToSymbol('times')} tientallen`;
          fontSizeFactor = 0.6;
          break;
        default:
          throw new UnexpectedValueError(variantInfo.tableSet);
      }
    }
    return html` <zeppelin-image
      .color=${variantInfo.iconColor}
      .stringToShow=${stringToShow}
      .fontSizeFactor=${fontSizeFactor}
    ></zeppelin-image>`;
  }

  renderUfo(variantInfo: ExtendedVariantInfo): HTMLTemplateResult {
    let symbol1 = '';
    let symbol2 = '';
    let content = '';

    switch (variantInfo.operators.length) {
      case 1:
        symbol1 = operatorToSymbol(variantInfo.operators[0]);
        break;
      case 2:
        symbol1 = operatorToSymbol(variantInfo.operators[0]);
        symbol2 = operatorToSymbol(variantInfo.operators[1]);
        break;
      default:
        throw new Error(
          `Internal SW Error, number of operators ${variantInfo.operators.length} should not be possible for flying saucer variants`,
        );
    }

    if (typeof variantInfo.tableSet === 'number') {
      content = `${variantInfo.tableSet}`;
    } else {
      switch (variantInfo.tableSet) {
        case 'firstHalf':
        case '2-10':
        case 'tens':
          throw new Error(
            `Internal SW Error, tableSet ${variantInfo.tableSet} should not be possible for zeppelin variants`,
          );
        case '11-14':
          content = `11-14`;
          break;
        case '11-19':
          content = `11-19`;
          break;
        default:
          throw new UnexpectedValueError(variantInfo.tableSet);
      }
    }

    return html`
      <flying-saucer
        .color=${variantInfo.iconColor}
        .symbol1=${symbol1}
        .symbol2=${symbol2}
        .content=${content}
      ></flying-saucer>
    `;
  }
  renderRocket(variantInfo: ExtendedVariantInfo): HTMLTemplateResult {
    const stringsToShow: string[] = [];

    switch (variantInfo.operators.length) {
      case 1:
        stringsToShow.push(operatorToSymbol(variantInfo.operators[0]));
        break;
      case 2:
        stringsToShow.push(
          `${operatorToSymbol(variantInfo.operators[0])}${operatorToSymbol(variantInfo.operators[1])}`,
        );
        break;
      default:
        throw new Error(
          `Internal SW Error, number of operators ${variantInfo.operators.length} should not be possible for rocket variants`,
        );
    }

    let fontSizeFactor = 1;
    if (typeof variantInfo.tableSet === 'number') {
      stringsToShow.push(`${variantInfo.tableSet}`);
      fontSizeFactor = 0.3;
    } else {
      switch (variantInfo.tableSet) {
        case 'firstHalf':
          stringsToShow.push('2-5');
          stringsToShow.push('10');
          fontSizeFactor = 0.23;
          break;
        case '2-10':
          stringsToShow.push('2-10');
          fontSizeFactor = 0.23;
          break;
        case '11-14':
        case '11-19':
        case 'tens':
          throw new Error(
            `Internal SW Error, tableSet ${variantInfo.tableSet} should not be possible for rocket variants`,
          );
          break;
        default:
          throw new UnexpectedValueError(variantInfo.tableSet);
      }
    }

    return html` <rocket-image
      .color=${variantInfo.iconColor}
      .stringsToShow=${stringsToShow}
      .fontSizeFactor=${fontSizeFactor}
    ></rocket-image>`;
  }

  render(): HTMLTemplateResult {
    const variantInfo = getGameVariant(this.variant);
    switch (variantInfo.image) {
      case 'balloon':
        return this.renderBalloon(variantInfo);
      case 'rocket':
        return this.renderRocket(variantInfo);
      case 'zeppelin':
        return this.renderZeppelin(variantInfo);
      case 'ufo':
        return this.renderUfo(variantInfo);
      default:
        throw new UnexpectedValueError(variantInfo.image);
    }
  }
}
