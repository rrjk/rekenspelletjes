import { html, css, LitElement, unsafeCSS } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';
import { getColorInfo } from './Colors';

import { getHandAsSvgUrl } from './HandImage';

// import './RealHeight';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    const iconUrl1 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        1
      )
    )}`;
    const iconUrl2 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        2
      )
    )}`;
    const iconUrl3 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        3
      )
    )}`;
    const iconUrl4 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        4
      )
    )}`;
    const iconUrl5 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        5
      )
    )}`;
    const iconUrl6 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        6
      )
    )}`;
    const iconUrl7 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        7
      )
    )}`;
    const iconUrl8 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        8
      )
    )}`;
    const iconUrl9 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        9
      )
    )}`;
    const iconUrl10 = `data:image/svg+xml,${unsafeCSS(
      getHandAsSvgUrl(
        getColorInfo('purple').mainColorCode,
        getColorInfo('orange').mainColorCode,
        10
      )
    )}`;

    const a = css`
      #div1 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl1)}');
      }
      #div2 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl2)}');
      }
      #div3 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl3)}');
      }
      #div4 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl4)}');
      }
      #div5 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl5)}');
      }
      #div6 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl6)}');
      }
      #div7 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl7)}');
      }
      #div8 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl8)}');
      }
      #div9 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl9)}');
      }
      #div10 {
        background-size: 200px 200px;
        height: 200px;
        width: 200px;
        color: black;
        border: 2px black solid;
        background-image: url('${unsafeCSS(iconUrl10)}');
      }
    `;

    return [a];
  }

  protected render(): HTMLTemplateResult {
    return html` <hand-with-dots
        numberDots="5"
        style="width: 200px; height: 200px; --hand-color: #ff00ff; --dot-color:green;"
      ></hand-with-dots>
      <div id="div1"></div>
      <div id="div2"></div>
      <div id="div3"></div>
      <div id="div4"></div>
      <div id="div5"></div>
      <div id="div6"></div>
      <div id="div7"></div>
      <div id="div8"></div>
      <div id="div9"></div>
      <div id="div10"></div>`;
  }
}
