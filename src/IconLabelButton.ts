import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { BalloonColors } from './BalloonWithTextOverlay';
import './BalloonWithTextOverlay';

/** Possible balloon colors */
type TimeEnum = '1min' | '3min';

@customElement('icon-label-button')
export class IconLabelButton extends LitElement {
  @property()
  title = '';
  @property()
  href = '';

  static get styles(): CSSResultGroup {
    return css`
      a {
        text-decoration: none;
        color: black;
        border: 1px solid black;
        padding: 2px 8px;
        display: grid;
        grid-template-columns: 140px auto;
        background-color: lightgrey;
        align-items: center;
        border-radius: 20px;
      }

      p {
        font-size: 25px;
        margin: 0;
        padding: 0;
      }
    `;
  }

  render(): HTMLTemplateResult {
    return html`
      <a href="${this.href}" title="${this.title}">
        <slot></slot>
        <p>${this.title}</p>
      </a>
    `;
  }
}
