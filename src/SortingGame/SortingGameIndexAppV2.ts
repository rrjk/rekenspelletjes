import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderSortingGameHourglassGameIcon } from './SortingGameHourglassGameIcon';

/** Supported logical page keys for this variant index app. */
type IndexPage = 'basicSorting' | 'largeNumbers' | 'decimalNumbers';

/** Converts a raw attribute value to a valid index page key. */
export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'basicSorting':
      return value;
    case 'largeNumbers':
      return value;
    case 'decimalNumbers':
      return value;
    default:
      return 'basicSorting';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}
interface IndexPageType {
  basicSorting: SectionInfoType[];
  largeNumbers: SectionInfoType[];
  decimalNumbers: SectionInfoType[];
}

const sections: IndexPageType = {
  basicSorting: [
    {
      title: 'Zet de getallen 1 - 10 in de goede volgorde',
      rows: ['aa', 'ab', 'ac'],
    },
    {
      title: 'Zet de getallen 1 - 30 in de goede volgorde',
      rows: ['ba', 'bb', 'bc'],
    },
    {
      title: 'Zet de getallen 1 - 50 in de goede volgorde',
      rows: ['ca', 'cb', 'cc'],
    },
    {
      title: 'Zet de getallen 1 - 100 in de goede volgorde',
      rows: ['da', 'db', 'dc'],
    },
  ],
  largeNumbers: [
    {
      title: 'Zet getallen tot 1000 of 10000 in de goede volgorde',
      rows: ['ea', 'eb'],
    },
  ],
  decimalNumbers: [
    {
      title: 'Zet de kommagetallen in de juiste volgorde',
      rows: ['fa', 'fb', 'fc'],
    },
  ],
};

/** Time codes shown for each variant as a left/right icon pair. */
const durations: TimeCode[] = ['a', 'b'];

/**
 * Variant index app for Sorting Game.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('sorting-game-index-app-v2')
export class SortingGameIndexApp extends VariantIndexAppBase<IndexPage> {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'basicSorting';

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
    return renderSortingGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        sorting-game-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
