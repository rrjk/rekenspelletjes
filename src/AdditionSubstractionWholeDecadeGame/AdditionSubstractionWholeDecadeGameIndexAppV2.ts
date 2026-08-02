import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderAdditionSubstractionWholeDecadeGameHourglassGameIcon } from './AdditionSubstractionWholeDecadeGameHourglassGameIcon';

/** Supported logical page keys for this variant index app. */
type IndexPage = 'defaultPage';

/** Converts a raw attribute value to a valid index page key. */
export function convertIndexPage(value: string | null): IndexPage {
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
      title: 'Plus en min sommen met hele tientallen erbij of eraf',
      rows: ['aa', 'ab', 'ac'],
    },
    {
      title: 'Plus en min sommen vanuit een heel tiental',
      rows: ['ba', 'bb', 'bc'],
    },
  ],
};

/** Time codes shown for each variant as a left/right icon pair. */
const durations: TimeCode[] = ['a', 'b'];

/**
 * Variant index app for Addition Substraction Whole Decade Game.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('addition-substraction-whole-decade-game-index-app-v2')
export class AdditionSubstractionWholeDecadeGameIndexApp extends VariantIndexAppBase<IndexPage> {
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
    return renderAdditionSubstractionWholeDecadeGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        addition-substraction-whole-decade-game-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
