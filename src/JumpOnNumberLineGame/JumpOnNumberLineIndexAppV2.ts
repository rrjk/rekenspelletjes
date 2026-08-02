import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderJumpOnNumberLineHourglassGameIcon } from './JumpOnNumberLineHourglassGameIcon';

/** Supported logical page keys for this variant index app. */
type IndexPage = 'defaultPage';

/** Converts a raw attribute value to a valid index page key. */
function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'defaultPage':
      return value;
    default:
      return 'defaultPage';
  }
}

interface SectionInfoType {
  title: string;
  rows: string[];
}

interface IndexPageType {
  defaultPage: SectionInfoType[];
}

const sections: IndexPageType = {
  defaultPage: [
    {
      title: 'Getallenlijn van 0 tot 20',
      rows: ['aa', 'ab', 'ac', 'ad'],
    },
    {
      title: 'Getallenlijn van 0 tot 30',
      rows: ['ba', 'bb', 'bc', 'bd'],
    },
    {
      title: 'Getallenlijn van 0 tot 50',
      rows: ['ca', 'cb', 'cc', 'cd'],
    },
    {
      title: 'Getallenlijn van 0 tot 100',
      rows: ['da', 'db', 'dc', 'dd'],
    },
  ],
};

/** Time codes shown for each variant as a left/right icon pair. */
const durations: TimeCode[] = ['a', 'b'];

/**
 * Variant index app for Jump On Number Line.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('jump-on-numberline-index-app-v2')
export class JumpOnNumberLineIndexAppV2 extends VariantIndexAppBase<IndexPage> {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'defaultPage';

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
    return renderJumpOnNumberLineHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        jump-on-numberline-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
