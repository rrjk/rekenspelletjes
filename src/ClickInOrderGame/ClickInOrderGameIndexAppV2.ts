import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderClickInOrderGameHourglassGameIcon } from './ClickInOrderHourglassGameIcon';

/** Supported logical page keys for this variant index app. */
type IndexPage =
  | 'aanklikkenInVolgorde'
  | 'ballenKnallen'
  | 'ballenKnallenMetSom';

/** Converts a raw attribute value to a valid index page key. */
export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'aanklikkenInVolgorde':
    case 'ballenKnallen':
    case 'ballenKnallenMetSom':
      return value;
    default:
      return 'aanklikkenInVolgorde';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  aanklikkenInVolgorde: SectionInfoType[];
  ballenKnallen: SectionInfoType[];
  ballenKnallenMetSom: SectionInfoType[];
}

const sections: IndexPageType = {
  aanklikkenInVolgorde: [
    {
      title: '',
      rows: ['aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ba', 'bb', 'bc'],
    },
  ],
  ballenKnallen: [
    {
      title: '',
      rows: ['ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'cg', 'ch', 'ci'],
    },
  ],
  ballenKnallenMetSom: [
    {
      title: '',
      rows: ['da', 'db', 'dc', 'dd', 'de', 'df', 'dg', 'dh', 'di', 'dj', 'dk'],
    },
  ],
};

/**
 * Variant index app for Click In Order and related balloon variants.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('click-in-order-game-index-app-v2')
export class ClickInOrderGameIndexApp extends VariantIndexAppBase<IndexPage> {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'aanklikkenInVolgorde';

  protected get selectedPage(): IndexPage {
    return this.indexPage;
  }

  protected get sectionsByPage(): VariantSections<IndexPage> {
    return sections;
  }

  protected get iconRenderer() {
    return renderClickInOrderGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        click-in-order-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
