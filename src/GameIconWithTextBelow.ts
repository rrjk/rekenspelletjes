import { LitElement, html, css, unsafeCSS } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property } from 'lit/decorators.js';

/** Possible balloon colors */
export type IconColors =
  | 'yellow'
  | 'purple'
  | 'yellowPurple'
  | 'green'
  | 'blue';

export type ImageTypes = 'balloon' | 'kite' | 'rocket';

@customElement('game-icon-with-text-below')
export class GameIconWithTextOnBelow extends LitElement {
  @property()
  iconcolor: IconColors = 'yellow';
  @property()
  image: ImageTypes = 'balloon';
  @property()
  textM = '';
  @property()
  textB = '';

  static get styles(): CSSResultGroup {
    return css`
      .balloon,
      .kite,
      .rocket {
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

      .rocket {
        background-size: 90px 90px;
        width: 90px;
        height: 90px;
        line-height: 90px;
      }

      .kiteBlue {
        background-image: url('${unsafeCSS(
          new URL('../images/kite-blue.svg', import.meta.url)
        )}');
      }

      .kitePurple {
        background-image: url('${unsafeCSS(
          new URL('../images/kite-purple.svg', import.meta.url)
        )}');
      }

      .kiteGreen {
        background-image: url('${unsafeCSS(
          new URL('../images/kite-green.svg', import.meta.url)
        )}');
      }

      .kiteYellow {
        background-image: url('${unsafeCSS(
          new URL('../images/kite-yellow.svg', import.meta.url)
        )}');
      }

      .balloonBlue {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-blue.png', import.meta.url)
        )}');
      }

      .balloonPurple {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-purple.png', import.meta.url)
        )}');
      }

      .balloonGreen {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-green.png', import.meta.url)
        )}');
      }

      .balloonYellow {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-yellow.png', import.meta.url)
        )}');
      }

      .balloonYellowPurple {
        background-image: url('${unsafeCSS(
          new URL('../images/balloon-yellow-purple.png', import.meta.url)
        )}');
      }

      .rocketBlue {
        background-image: url('${unsafeCSS(
          new URL('../images/rocket-blue.svg', import.meta.url)
        )}');
      }

      .rocketPurple {
        background-image: url('${unsafeCSS(
          new URL('../images/rocket-purple.svg', import.meta.url)
        )}');
      }

      .rocketGreen {
        background-image: url('${unsafeCSS(
          new URL('../images/rocket-green.svg', import.meta.url)
        )}');
      }

      .rocketYellow {
        background-image: url('${unsafeCSS(
          new URL('../images/rocket-yellow.svg', import.meta.url)
        )}');
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
    `;
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
