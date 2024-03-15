import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';

import './PixelArtColorField';
import './PixelArtNumberField';

// import './RealHeight';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        heart-image {
          width: 200px;
          height: 200px;
          border: 1px solid blue;
        }
      `,
    ];
  }

  protected render(): HTMLTemplateResult {
    return html`<p>Test</p>
      <pixel-art-color-field
        style="width: 250px"
        .matrix=${[
          ['red', 'blue', 'green', 'red'],
          ['green', 'red', 'blue', 'green'],
          ['blue', 'green', 'red', 'blue'],
          ['red', 'blue', 'green', 'purple'],
        ]}
      ></pixel-art-color-field>
      <pixel-art-number-field
        style="width: 250px"
        .matrix=${[
          [1, 2, 3, 4],
          [2, 3, 4, 5],
          [3, 4, 1, 6],
          [4, 1, 2, 9],
        ]}
      ></pixel-art-number-field> `;
  }
}
