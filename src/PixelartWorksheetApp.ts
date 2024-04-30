import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, state } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import './PixelArtColorSelector';
import type { Color, ColorSelectedEvent } from './ColorPicker';
import './ColorPicker';

// import './RealHeight';

@customElement('pixel-art-worksheet-app')
export class TestApp extends LitElement {
  static initialColor: Color = 'red';
  static colorPalette: Color[] = [
    'red',
    'green',
    'blue',
    'orange',
    'yellow',
    'purple',
    'brown',
    'magenta',
    'lime',
    'cyan',
  ];

  static get styles(): CSSResultArray {
    return [css``];
  }

  @state()
  selectedColor: Color = TestApp.initialColor;

  handeColorSelected(color: Color) {
    console.log(`handleColorSelected in PixelArtColorSelect, color = ${color}`);
    this.selectedColor = color;
  }

  protected render(): HTMLTemplateResult {
    /*
    const colorMatrix: Color[][] = [
      ['green', 'blue', 'green', 'red'],
      ['green', 'red', 'blue', 'green'],
      ['blue', 'green', 'red', 'blue'],
      ['red', 'blue', 'green', 'purple'],
    ];
    const questions = calculateQuestionAssignment(colorMatrix, 8);
    console.log(questions);
    */

    return html`
    <p>Test</p>
      <color-picker
        selectedColor="${TestApp.initialColor}"
        .selectableColors=${TestApp.colorPalette}
        @color-selected="${(evt: ColorSelectedEvent) =>
          this.handeColorSelected(evt.color)}"
      ></color-picker>

      <pixel-art-color-selector selectedColor="${
        this.selectedColor
      }" style="width: 150px; height: 150px;"></PixelArtColorSelector>`;
  }
}
