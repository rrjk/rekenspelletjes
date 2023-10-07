import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

import type { Color } from './Colors';

import type { GameIcon } from './GameIcons';
import { getIconStyles } from './GameIcons';

@customElement('game-icon-with-text-below')
export class GameIconWithTextOnBelow extends LitElement {
  @property()
  iconcolor: Color = 'yellow';
  @property()
  image: GameIcon = 'balloon';
  @property()
  textM = '';
  @property()
  textB = '';

  static get styles(): CSSResult[] {
    const styles: CSSResult[] = [
      css`
        .balloon,
        .kite,
        .rocket,
        .zeppelin {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: none;
          outline: none;
          color: black;
          text-align: center;
          margin: 2px;
          padding: 0;
        }

        .balloon {
          background-size: 75px 90px;
          width: 75px;
          height: 90px;
          line-height: 78px;
        }

        .kite {
          background-size: 70px 105px;
          width: 70px;
          height: 105px;
          line-height: 80px;
        }

        .zeppelin {
          background-size: 120px 90px;
          width: 120px;
          height: 90px;
          line-height: 80px;
        }

        .rocket {
          background-size: 90px 90px;
          width: 90px;
          height: 90px;
          line-height: 90px;
        }

        .textM,
        .textB {
          position: relative;
          line-height: normal;
          text-align: center;
        }

        .textM {
          width: 20%;
        }

        .rocket .textM {
          top: -0.2em;
        }

        .textB {
          width: 90px;
        }
      `,
    ];
    return styles
      .concat(getIconStyles('balloon'))
      .concat(getIconStyles('kite'))
      .concat(getIconStyles('rocket'))
      .concat(getIconStyles('zeppelin'));
  }

  render(): HTMLTemplateResult {
    // Determine the number of texts that are not empty
    const balloonColorClass =
      this.iconcolor.charAt(0).toUpperCase() + this.iconcolor.slice(1);

    return html`
      <div class="${this.image} ${this.image}${balloonColorClass}">
        <span class="textM">${this.textM}</span>
      </div>
      <div class="textB">${this.textB}</span>
    `;
  }
}
