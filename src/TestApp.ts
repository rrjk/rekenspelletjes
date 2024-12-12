import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';
import './DigitFillin';

import './NumberLineV2';

// import './RealHeight';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        number-line-v2 {
          width: 100%;
          border: 1px solid blue;
        }
      `,
    ];
  }

  protected renderComplex(): HTMLTemplateResult {
    return html`<p>Test</p>
      <number-line-v2
        min="100"
        max="180"
        tickMarks="upToSingles"
        .arches=${[
          { from: 105, to: 103 },
          { from: 125, to: 115 },
        ]}
        .fixedNumbers=${[100, 116, 120, 180]}
        .numberBoxes=${[
          { nmbr: 104, visible: 'show' },
          { nmbr: 101, visible: 'show' },
          { nmbr: 102, visible: 'show' },
          { nmbr: 103, visible: 'show' },
          { nmbr: 115, visible: 'show' },
          { nmbr: 117, visible: 'show' },
          { nmbr: 118, visible: 'show' },
          { nmbr: 119, visible: 'show' },
          { nmbr: 121, visible: 'show' },
          { nmbr: 178, visible: 'show' },
          { nmbr: 179, visible: 'show' },
          { nmbr: 150, visible: 'show' },
          { nmbr: 151, visible: 'show' },
          { nmbr: 152, visible: 'show' },
          { nmbr: 153, visible: 'show' },
          { nmbr: 154, visible: 'show' },
          { nmbr: 155, visible: 'show' },
          { nmbr: 156, visible: 'show' },
          { nmbr: 157, visible: 'show' },
          { nmbr: 125, visible: 'show' },
          { nmbr: 123, visible: 'show' },
        ]}
      ></number-line-v2>`;
  }

  protected renderComplex2(): HTMLTemplateResult {
    return html`<p>Test</p>
      <number-line-v2
        min="0"
        max="100"
        tickMarks="upToSingles"
        .arches=${[
          { from: 47, to: 40 },
          { from: 40, to: 38 },
          { from: 38, to: 28 },
        ]}
        .fixedNumbers=${[0, 50, 100]}
        .numberBoxes=${[
          { nmbr: 47, visible: 'show' },
          { nmbr: 40, visible: 'show' },
          { nmbr: 28, visible: 'show' },
          { nmbr: 38, visible: 'show' },
        ]}
      ></number-line-v2>`;
  }

  protected render(): HTMLTemplateResult {
    return html`<p>Test</p>
      <number-line-v2
        min="0"
        max="100"
        tickMarks="upToSingles"
        .arches=${[
          { from: 7, to: 10 },
          { from: 10, to: 20 },
          { from: 20, to: 30 },
          { from: 30, to: 35 },
        ]}
        .fixedNumbers=${[0, 100]}
        .numberBoxes=${[
          { position: 7, nmbr: 7, active: 'wrong' },
          { position: 10, nmbr: 10, active: 'active' },
          { position: 20, nmbr: 20, active: 'notActive' },
          { position: 30, nmbr: undefined, active: 'active' },
          { position: 35, nmbr: 35 },
        ]}
      ></number-line-v2>`;
  }
}
