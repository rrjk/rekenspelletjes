import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';
import './DigitFillin';

import './Arch';

// import './RealHeight';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        number-line-arch {
          width: 250px;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`<p>Test</p>
      <number-line-arch width="8" position="above"></number-line-arch>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
