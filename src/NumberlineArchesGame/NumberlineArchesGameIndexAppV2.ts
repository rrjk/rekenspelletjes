import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderNumberlineArchesGameHourglassGameIcon } from './NumberlineArchesGameHourglassGameIcon';

/** Supported logical page keys for this variant index app. */
type IndexPage = 'plusPage' | 'minusPage';

/** Converts a raw attribute value to a valid index page key. */
export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'plusPage':
      return value;
    case 'minusPage':
      return value;
    default:
      return 'plusPage';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  plusPage: SectionInfoType[];
  minusPage: SectionInfoType[];
}

const sections: IndexPageType = {
  plusPage: [
    {
      title: 'Op een getallenlijn van 0 tot 10',
      rows: ['aa'],
    },
    {
      title: 'Op een getallenlijn van 0 tot 20',
      rows: ['ab', 'ac'],
    },
  ],
  minusPage: [
    {
      title: 'Op een getallenlijn van 0 tot 10',
      rows: ['ba'],
    },
    {
      title: 'Op een getallenlijn van 0 tot 20',
      rows: ['bb', 'bc'],
    },
  ],
};

/** Time codes shown for each variant as a left/right icon pair. */
const durations: TimeCode[] = ['b', 'c'];

/**
 * Variant index app for Numberline Arches Game.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('numberline-arches-game-index-app-v2')
export class NumberlineArchesGameIndexApp extends VariantIndexAppBase<IndexPage> {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'plusPage';

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
    return renderNumberlineArchesGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        numberline-arches-game-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
