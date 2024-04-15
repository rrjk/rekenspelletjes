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
      <pixel-art-color-field
        style="width: 250px"
        .matrix=${[
          ['green', 'blue', 'green', 'red'],
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
      ></pixel-art-number-field> 
      <pixel-art-color-selector  .matrix=${[
        ['green', 'blue', 'green', 'red'],
        ['green', 'red', 'blue', 'green'],
        ['blue', 'green', 'red', 'blue'],
        ['red', 'blue', 'green', 'purple'],
      ]} style="width: 200px; height: 200px;"></PixelArtColorSelector>`;
  }
}
