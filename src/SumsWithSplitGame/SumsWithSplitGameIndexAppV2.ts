import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderSumsWithSplitGameHourglassGameIcon } from './SumsWithSplitGameHourglassGameIcon';

/** Supported logical page keys for this variant index app. */
type IndexPage = 'tot20' | 'tot100Enkel' | 'tot100Dubbel';

/** Converts a raw attribute value to a valid index page key. */
export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'tot20':
    case 'tot100Enkel':
    case 'tot100Dubbel':
      return value;
    default:
      return 'tot20';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  tot20: SectionInfoType[];
  tot100Enkel: SectionInfoType[];
  tot100Dubbel: SectionInfoType[];
}

const sections: IndexPageType = {
  tot20: [
    {
      title: 'Sommen tot de 20',
      rows: ['aa', 'ab', 'ac'],
    },
    {
      title: 'Sommen tot de 20 met splitsen uit het hoofd',
      rows: ['ad', 'ae', 'af'],
    },
  ],
  tot100Enkel: [
    {
      title: 'Sommen tot de 100',
      rows: ['ba', 'bb', 'bc'],
    },
    {
      title: 'Sommen tot de 100 met splitsen uit het hoofd',
      rows: ['bd', 'be', 'bf'],
    },
  ],
  tot100Dubbel: [
    {
      title: 'Sommen tot de 100',
      rows: ['ca', 'cb', 'cc'],
    },
    {
      title: 'Sommen tot de 100 met splitsen uit het hoofd',
      rows: ['cd', 'ce', 'cf'],
    },
  ],
};

/**
 * Variant index app for Sums With Split Game.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('sums-with-split-game-index-app-v2')
export class SumsWithSplitGameIndexAppV2 extends VariantIndexAppBase<IndexPage> {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'tot20';

  protected get selectedPage(): IndexPage {
    return this.indexPage;
  }

  protected get sectionsByPage(): VariantSections<IndexPage> {
    return sections;
  }

  protected override get timeCodes(): TimeCode[] {
    if (this.indexPage === 'tot100Dubbel') return ['b', 'c'];
    return ['a', 'b'];
  }

  protected get iconRenderer() {
    return renderSumsWithSplitGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        sums-with-split-game-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
