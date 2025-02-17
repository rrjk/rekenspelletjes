import { CSSResultArray, html, css, LitElement } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';

import type { HTMLTemplateResult, PropertyValues } from 'lit';
import { HighlightType } from './DraggableElement';

import { gcd } from './NumberHelperFunctions';

@customElement('fraction-element')
export class FractionElement extends LitElement {
  @state()
  private accessor highlightState: HighlightType = 'none';

  @property()
  private accessor numerator = 1;
  @property()
  private accessor denumerator = 2;

  get value() {
    const _gcd = gcd(this.numerator, this.denumerator);
    return `${this.numerator / _gcd}/${this.denumerator / _gcd}`;
  }

  /** Get all static styles */
  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: inline-block;
        }
        div {
          width: 100%;
          height: 100%;
          border: 2px solid blue;
        }
      `,
    ];
  }

  protected willUpdate(_changedProperties: PropertyValues): void {
    console.log(`FractionElement - willUpdate`);
    console.log(_changedProperties);
  }

  render(): HTMLTemplateResult {
    return html`<div>
      ${this.numerator}/${this.denumerator} (${this.value}) </br> ${this.highlightState}
    </div>`;
  }
}
