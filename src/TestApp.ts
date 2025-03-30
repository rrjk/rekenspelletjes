import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';
import './FlyingSaucer';
import { colors } from './Colors';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    console.log(`styles`);
    return [
      css`
        flying-saucer {
          width: 100px;
          height: 100px;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`<p>Test</p>
      ${colors.map(
        color =>
          html`<flying-saucer color=${color} content="888"></flying-saucer>`,
      )} `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
