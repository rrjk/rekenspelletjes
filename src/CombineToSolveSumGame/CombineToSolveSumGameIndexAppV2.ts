import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderCombineToSolveSumGameHourglassGameIcon } from './CombineToSolveSumGameHourglassGameIcon';

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
      title: '',
      rows: ['aa'],
    },
  ],
};

/**
 * Variant index app for Combine To Solve Sum Game.
 *
 * This class supplies page selection, section data, and the icon renderer.
 * Rendering and layout are inherited from `VariantIndexAppBase`.
 */
@customElement('combine-to-solve-sum-game-index-app-v2')
export class CombineToSolveSumGameIndexApp extends VariantIndexAppBase<IndexPage> {
  @property({ converter: convertIndexPage })
  accessor indexPage: IndexPage = 'defaultPage';

  protected get selectedPage(): IndexPage {
    return this.indexPage;
  }

  protected get sectionsByPage(): VariantSections<IndexPage> {
    return sections;
  }

  protected get iconRenderer() {
    return renderCombineToSolveSumGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        :host {
        }

        combine-to-solve-sum-game-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
