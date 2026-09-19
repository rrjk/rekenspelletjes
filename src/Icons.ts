import { html, HTMLTemplateResult } from 'lit';

export function renderEditIcon(): HTMLTemplateResult {
  return html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
    >
      <path d="M17 83 22 63 59 25 75 41 37 78Z" stroke="black" fill="black" />
      <path
        d="M64 20 67 17A5.66 5.66 90 0 1 83 33L80 36Z"
        stroke="black"
        fill="black"
      />
    </svg>
  `;
}

export function renderTranscanIcon(): HTMLTemplateResult {
  return html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      fill="none"
    >
      <!-- Lid Top Handle -->
      <path
        d="M 37.5 12.5 C 37.5 9.74 39.74 7.5 42.5 7.5 L 57.5 7.5 C 60.26 7.5 62.5 9.74 62.5 12.5 L 62.5 17.5 L 37.5 17.5 Z"
        fill="currentColor"
      />

      <!-- Rim / Flap -->
      <rect
        x="12.5"
        y="17.5"
        width="75"
        height="10"
        rx="5"
        ry="5"
        fill="currentColor"
      />

      <!-- Trash Can Body with Rounded Bottom Corners -->
      <path
        d="M 21 32.5 L 26.13 83.8 C 26.63 88.75 30.8 92.5 35.78 92.5 L 64.22 92.5 C 69.2 92.5 73.37 88.75 73.87 83.8 L 79 32.5 Z"
        fill="currentColor"
      />

      <!-- Vertical Cutout Slots (Revealing Background) -->
      <rect
        x="37.5"
        y="42.5"
        width="7.5"
        height="37.5"
        rx="3.75"
        fill="#FFFFFF"
      />
      <rect
        x="55"
        y="42.5"
        width="7.5"
        height="37.5"
        rx="3.75"
        fill="#FFFFFF"
      />
    </svg>
  `;
}
