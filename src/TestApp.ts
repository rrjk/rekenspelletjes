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

  protected render(): HTMLTemplateResult {
    return html`<p>Test</p>
      <number-line-v2
        min="0"
        max="100"
        tickMarks1="show"
        tickMarks5="show"
        tickMarks10="show"
        .arches=${[
          { from: 10, to: 18 },
          { from: 34, to: 48 },
          { from: 56, to: 48 },
          { from: 60, to: 61 },
          { from: 70, to: 68 },
          { from: 75, to: 80 },
          { from: 80, to: 90 },
          { from: 90, to: 92 },
        ]}
      ></number-line-v2>`;
  }
}
