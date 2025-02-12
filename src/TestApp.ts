import { html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray, HTMLTemplateResult } from 'lit';

// import { darken, lighten } from 'color2k';
import './DraggableTargetSlotted';

import './Arch';

// import './RealHeight';

@customElement('test-app')
export class TestApp extends LitElement {
  static get styles(): CSSResultArray {
    console.log(`styles`);
    return [
      css`
        draggable-target-fraction {
          width: 100px;
          height: 100px;
        }
      `,
    ];
  }

  protected renderTest(): HTMLTemplateResult {
    return html`<p>Test</p>
      <draggable-target-slotted>
        <div>BBB</div>
        <div>CCC</div>
      </draggable-target-slotted>`;
  }

  protected render(): HTMLTemplateResult {
    return this.renderTest();
  }
}
