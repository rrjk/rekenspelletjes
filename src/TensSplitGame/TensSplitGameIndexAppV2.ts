import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultArray } from 'lit';
import type { TimeCode } from '../TimeCodes';

import {
  VariantIndexAppBase,
  type VariantSections,
} from '../IndexAppV2/VariantIndexAppBase';
import { renderTensSplitGameHourglassGameIcon } from './TensSplitGameHourglassGameIcon';

type IndexPage = 'defaultPage';

export function convertIndexPage(value: string | null): IndexPage {
  switch (value) {
    case 'defaultPage':
      return value;
    default:
      return 'defaultPage';
  }
}

const sections: VariantSections<IndexPage> = {
  defaultPage: [{ title: 'Splitsen in tientallen en eenheden', rows: ['aa'] }],
};

const durations: TimeCode[] = ['a', 'b'];

@customElement('tens-split-game-index-app-v2')
export class TensSplitGameIndexAppV2 extends VariantIndexAppBase<IndexPage> {
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
    return renderTensSplitGameHourglassGameIcon;
  }

  static get styles(): CSSResultArray {
    return [
      super.styles,
      css`
        tens-split-game-hourglass-game-icon {
          min-width: 0;
        }
      `,
    ];
  }
}
