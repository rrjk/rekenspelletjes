import { html, css, LitElement } from 'lit';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

import { customElement } from 'lit/decorators.js';

import './DieFace';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          width: 100%;
          height: 100%;
          display: block;
        }
        die-face {
          width: 100px;
          height: 100px;
        }
      `,
    ];
  }
  protected renderTest(): HTMLTemplateResult {
    return html`
      <die-face numberDots="1" dieFaceColor="apricot"></die-face>
      <die-face numberDots="2" dieFaceColor="blue"></die-face>
      <die-face numberDots="3" dieFaceColor="mint"></die-face>
      <die-face numberDots="4" dieFaceColor="lavender"></die-face>
      <die-face numberDots="5" dieFaceColor="pink"></die-face>
      <die-face numberDots="6" dieFaceColor="red"></die-face>
      <die-face dieFaceColor="green"></die-face>
      <die-face numberDots="7" dieFaceColor="black"></die-face>
    `;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
