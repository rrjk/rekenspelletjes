import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';

import './QuestionCreationWidget';

// import './RealHeight';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [css``];
  }

  protected render(): HTMLTemplateResult {
    return html`<p>Test</p>
      <question-creation-widget></question-creation-widget> `;
  }
}
