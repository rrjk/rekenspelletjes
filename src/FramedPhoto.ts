/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit';
import type { TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import { customElement, property, state } from 'lit/decorators.js';
import { FramedPhotoSVG, PhotoId } from './FramedPhotoSVG';

@customElement('framed-photo')
export class FramedPhoto extends LitElement {
  @property({ type: String })
  photoId: PhotoId = 'Frank';
  @property({ type: Boolean })
  disabled = false;

  @state()
  framedPhoto = new FramedPhotoSVG();

  willUpdate(_changedProperties: Map<string | number | symbol, unknown>): void {
    if (_changedProperties.has('photoId')) {
      this.framedPhoto.photoId = this.photoId;
      this.requestUpdate();
    }
  }

  static getFrameColor(photoId: PhotoId): string {
    return FramedPhotoSVG.getFrameColor(photoId);
  }

  /** Render the photoframe
   * @return Template for the photoframe, including attaching line.
   */
  render(): TemplateResult {
    return html`
      <div>
        <svg
          style="position:absolute; width: 100%; height: 1px; padding-bottom: calc(100% - 1px); overflow: visible;"
          viewBox="0 0 44 44"
          preserveAspectRatio="xMidYMin slice"
        >
          ${this.framedPhoto.render()}
        </svg>
      </div>
    `;
  }
}
