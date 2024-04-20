import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';

import './PixelArtColorField';
import './PixelArtNumberField';
import './PixelArtColorSelector';
import { Color } from './Colors';
import { calculateQuestionAssignment } from './ColorAssigner';

// import './RealHeight';

@customElement('pixel-art-worksheet-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [css``];
  }

  protected render(): HTMLTemplateResult {
    const colorMatrix: Color[][] = [
      ['green', 'blue', 'green', 'red'],
      ['green', 'red', 'blue', 'green'],
      ['blue', 'green', 'red', 'blue'],
      ['red', 'blue', 'green', 'purple'],
    ];
    const questions = calculateQuestionAssignment(colorMatrix, 8);
    console.log(questions);

    return html`<p>Test</p>
      <pixel-art-color-selector  .matrix=${colorMatrix} style="width: 200px; height: 200px;"></PixelArtColorSelector>`;
  }
}
