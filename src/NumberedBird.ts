import { LitElement, html, css } from 'lit';
import type { HTMLTemplateResult, CSSResultArray } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import { getColorInfo, type Color, stringToColor } from './Colors';

@customElement('numbered-bird')
export class NumberedBird extends LitElement {
  /** Number  to show */
  @property({ type: Number })
  accessor nmbrToShow = 3;
  /** Color of the die face to use */
  @property({ converter: stringToColor })
  accessor birdColor: Color = 'blue';
  @property({ type: Boolean })
  accessor disabled = false;

  static get styles(): CSSResultArray {
    return [
      css`
        :host {
          display: block;
        }

        .stroke {
          stroke: var(--birdColor, #4fc3f7);
          stroke-width: 8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .thinstroke {
          stroke: var(--birdColor, #4fc3f7);
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .body {
          fill: url(#bellyGradient);
        }
        .wing {
          fill: var(--wingColor, #29b6f6);
        }
        .beak {
          fill: #ffb300;
        }
        .eye {
          fill: url(#eyeGradient);
        }
        .belly {
          fill: url(#bellyGradient);
        }
        .foot {
          stroke: #ffb300;
          stroke-width: 5;
          fill: none;
        }
        .number {
          font-family: 'Comic Sans MS', Arial, sans-serif;
          font-weight: 700;
          font-size: 80px;
          fill: #222;
          text-anchor: middle;
          dominant-baseline: middle;
        }
      `,
    ];
  }

  render(): HTMLTemplateResult {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="17 35 201 173">
        <style>
          :host {
            --birdColor: ${getColorInfo(this.birdColor).mainColorCode};
            --wingColor: ${getColorInfo(this.birdColor).accentColorCode};
          }
        </style>

        <defs>
          <!-- soft radial highlight for belly -->
          <radialGradient id="bellyGradient" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fff" stop-opacity="1" />
            <stop offset="100%" stop-color="#f0f0f0" stop-opacity="1" />
          </radialGradient>

          <!-- glossy eye gradient -->
          <radialGradient id="eyeGradient" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#555" />
            <stop offset="80%" stop-color="#111" />
            <stop offset="100%" stop-color="#000" />
          </radialGradient>
        </defs>

        <!-- feet with curved legs (behind body, medium length) -->
        <g class="foot">
          <!-- left leg -->
          <path d="M100 180 q-3 8 0 15" />
          <path d="M100 195 q-8 5 -8 10" />
          <path d="M100 195 q0 6 0 12" />
          <path d="M100 195 q8 5 8 10" />
          <!-- right leg -->
          <path d="M140 180 q3 8 0 15" />
          <path d="M140 195 q-8 5 -8 10" />
          <path d="M140 195 q0 6 0 12" />
          <path d="M140 195 q8 5 8 10" />
        </g>

        <!-- body (oval, on top of legs) -->
        <ellipse class="body stroke" cx="120" cy="120" rx="85" ry="70" />

        <!-- feather tuft -->
        <!-- <path class="body stroke" d="M110 45 q6 -15 15 0 q6 -12 15 0" /> -->

        <!-- tail with 3 feather tips -->
        <path
          class="body stroke"
          d="M40 120 
                               q-15 -10 -20 0 
                               q5 10 15 15 
                               q-10 0 -15 10 
                               q10 8 20 5"
        />

        <!-- wing (hugging belly) -->
        <path
          class="wing thinstroke"
          d="M55 120 
                               q-10 25 25 35 
                               q30 10 40 -15 
                               q-20 -20 -65 -20z"
        />

        <!-- belly -->
        <!-- <circle class="belly stroke" cx="120" cy="130" r="48" />
        -->

        <!-- beak -->
        <polygon class="beak thinstroke" points="185,100 215,110 185,120" />

        <!-- eye -->
        <circle class="eye thinstroke" cx="160" cy="75" r="10" />
        <circle cx="157" cy="72" r="3" fill="#fff" />

        <!-- number (centered in belly) -->
        <text id="number" class="number" x="145" y="135">
          ${this.disabled ? '✗' : this.nmbrToShow}
        </text>
      </svg>
    `;
  }

  renderOld(): HTMLTemplateResult {
    return html`
      <style>
        :host {
          --birdColor: ${getColorInfo(this.birdColor).mainColorCode};
          --wingColor: ${getColorInfo(this.birdColor).accentColorCode};
        }
      </style>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 240"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- soft radial highlight for belly -->
          <radialGradient id="bellyGradient" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fff" stop-opacity="1" />
            <stop offset="100%" stop-color="#d0d0d0" stop-opacity="1" />
          </radialGradient>

          <!-- glossy eye gradient -->
          <radialGradient id="eyeGradient" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#555" />
            <stop offset="80%" stop-color="#111" />
            <stop offset="100%" stop-color="#000" />
          </radialGradient>
        </defs>

        <!-- body (oval) -->
        <ellipse class="body stroke" cx="120" cy="120" rx="85" ry="70" />

        <!-- feather tuft -->
        <path class="body stroke" d="M110 45 q6 -15 15 0 q6 -12 15 0" />

        <!-- tail with 3 feather tips -->
        <path
          class="body stroke"
          d="M40 120 
             q-15 -10 -20 0 
             q5 10 15 15 
             q-10 0 -15 10 
             q10 8 20 5"
        />

        <!-- wing (rounded teardrop) -->
        <path
          class="wing stroke"
          d="M70 115 
             q-10 20 15 30 
             q30 5 35 -20 
             q-20 -15 -50 -10z"
        />

        <!-- belly with gradient -->
        <circle class="belly stroke" cx="120" cy="145" r="38" />

        <!-- beak -->
        <polygon class="beak stroke" points="185,115 215,125 185,135" />

        <!-- eye with gradient + highlight -->
        <circle class="eye stroke" cx="150" cy="95" r="10" />
        <circle cx="147" cy="92" r="3" fill="#fff" />

        <!-- feet with rounded toes -->
        <g class="foot">
          <!-- left leg -->
          <line x1="100" y1="185" x2="100" y2="200" />
          <path d="M100 200 q-8 5 -8 10" />
          <path d="M100 200 q0 6 0 12" />
          <path d="M100 200 q8 5 8 10" />

          <!-- right leg -->
          <line x1="140" y1="185" x2="140" y2="200" />
          <path d="M140 200 q-8 5 -8 10" />
          <path d="M140 200 q0 6 0 12" />
          <path d="M140 200 q8 5 8 10" />
        </g>

        <!-- number -->
        <text id="number" class="number" x="120" y="145">
          ${this.disabled ? '✗' : this.nmbrToShow}
        </text>
      </svg>
    `;
  }
}
