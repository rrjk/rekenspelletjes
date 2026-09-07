import { html, HTMLTemplateResult } from 'lit';

export function renderEditIcon(): HTMLTemplateResult {
  return html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="24"
        stroke="black"
        stroke-width="5"
      />
      <path d="M17 83 22 63 59 25 75 41 37 78Z" stroke="black" fill="black" />
      <path
        d="M64 20 67 17A5.66 5.66 90 0 1 83 33L80 36Z"
        stroke="black"
        fill="black"
      />
    </svg>
  `;
}
