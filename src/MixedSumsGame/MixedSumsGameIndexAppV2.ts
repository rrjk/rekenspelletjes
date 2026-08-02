import { css } from 'lit';

import { customElement, property } from 'lit/decorators.js';

import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderMixedSumsGameHourglassGameIcon } from './MixedSumsHourglassGameIcon';

/** Supported logical page keys for this variant index app. */
type IndexPage = 'mixedSums';

/**
 * Converts a raw attribute value to a valid index page key.
 *
 * Invalid values fall back to the default Mixed Sums page.
 */
export function convertGame(value: string | null): IndexPage {
  switch (value) {
    case 'mixedSums':
      return value;
    default:
      return 'mixedSums';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  mixedSums: SectionInfoType[];
}

const sections: IndexPageType = {
  mixedSums: [
    {
      title: 'Gemengde sommen met puzzel',
      rows: ['aa', 'ab', 'ac', 'ai', 'aj', 'ad', 'ae', 'af', 'ag', 'ah'],
    },
    {
      title: 'Gemengde sommen zonder puzzel',
      rows: ['ba', 'bb', 'bc', 'bi', 'bj', 'bd', 'be', 'bf', 'bg', 'bh'],
    },
  ],
};

/** Time codes shown for each variant as a left/right icon pair. */
const durations: TimeCode[] = ['a', 'b'];

/**
 * Variant index app for Mixed Sums.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('mixed-sums-game-index-app-v2')
export class MixedSumsGameIndexApp extends VariantIndexAppBase<IndexPage> {
  @property({ converter: convertGame })
  accessor indexPage: IndexPage = 'mixedSums';

  protected get selectedPage(): IndexPage {
    return this.indexPage;
  }

  protected get sectionsByPage(): VariantSections<IndexPage> {
    return sections;
  }

  protected override get timeCodes(): TimeCode[] {
    return durations;
  }

  protected get iconRenderer() {
    return renderMixedSumsGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        mixed-sums-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
