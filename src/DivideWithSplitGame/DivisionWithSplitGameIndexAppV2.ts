import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderDivisionWithSplitGameHourglassGameIcon } from './DivisionWithSplitGameHourglassGameIcon';

type IndexPage = 'defaultPage';

const sections: VariantSections<IndexPage> = {
  defaultPage: [
    {
      title: 'Delen met splitsen',
      rows: ['aa', 'ab', 'ac'],
    },
  ],
};

@customElement('division-with-split-game-index-app-v2')
export class DivisionWithSplitGameIndexAppV2 extends VariantIndexAppBase<IndexPage> {
  protected get selectedPage(): IndexPage {
    return 'defaultPage';
  }

  protected get sectionsByPage(): VariantSections<IndexPage> {
    return sections;
  }

  protected override get timeCodes(): TimeCode[] {
    return ['b', 'c'];
  }

  protected get iconRenderer() {
    return renderDivisionWithSplitGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        division-with-split-game-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
