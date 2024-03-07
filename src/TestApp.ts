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
      <pixel-art-color-field></pixel-art-color-field>
      <pixel-art-number-field
        pixelSize="50"
        style="width: 250px"
      ></pixel-art-number-field> `;
  }
}
