import { customElement } from 'lit/decorators.js';

import { type IndexPage, GoalCardIndexApp } from './GoalCardIndexApp';

import { renderMixedSumsGameHourglassGameIcon } from '../MixedSumsGame/MixedSumsHourglassGameIcon';
import { renderAdditionSubstractionWithinDecadeGameHourglassGameIcon } from '../AdditionSubstractionWithinDecadeGame/AdditionSubstractionWithinDecadeGameHourglassGameIcon';
import {
  RenderGameIconFunction,
  renderNotImplemented,
} from '../RenderGameIconFunction';
import { renderSplitBalloonGameHourglassGameIcon } from '../SplitBalloonGame/SplitBalloonGameHourglassGameIcon';
import { renderSumsWithSplitGameHourglassGameIcon } from '../SumsWithSplitGame/SumsWithSplitGameHourglassGameIcon';
import { renderMultiplicationTablesBalloonHourglassGameIcon } from '../MultiplicationTablesBalloonGame/MultiplicationTablesBalloonHourglassGameIcon';
import { storeMenuPage } from '../NavigationHelper';
import { GameCode, gameCodes } from '../GameCodes';
import { encodeSectionInfoList } from './SectionInfoType';

@customElement('sumtype-index-app-631b663a-fef2-4656-8279-1deeb397e071')
export class SumTypeIndexApp631b663afef2465682791deeb397e071 extends GoalCardIndexApp {
  constructor() {
    super();
    storeMenuPage();
    console.log(encodeSectionInfoList(this.sections.defaultPage));
  }

  get pageTitle(): string {
    return `Doelenkaart Bovenbouw`;
  }

  sections: IndexPage = {
    defaultPage: [
      {
        title: 'Splitsingen',
        rows: [
          {
            entries: [
              {
                game: 'R',
                variant: 'bc',
                timeCode: 'a',
              },
            ],
          },
        ],
      },
      {
        title: 'Plussommen',
        rows: [
          {
            entries: [
              {
                game: 'A',
                variant: 'aa',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ia',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'A',
                variant: 'ba',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'id',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'A',
                variant: 'ca',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ip',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'G',
                variant: 'aa',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ig',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'G',
                variant: 'ba',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ij',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'AG',
                variant: 'ja',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'AG',
                variant: 'jb',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'AG',
                variant: 'jb',
                timeCode: 'b',
              },
            ],
          },
        ],
      },
      {
        title: 'Minsommen',
        rows: [
          {
            entries: [
              {
                game: 'A',
                variant: 'ab',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ib',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'A',
                variant: 'bb',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ie',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'A',
                variant: 'cb',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'iq',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'G',
                variant: 'ab',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ih',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'G',
                variant: 'bb',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ik',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'AG',
                variant: 'jc',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'AG',
                variant: 'jd',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'AG',
                variant: 'jd',
                timeCode: 'b',
              },
            ],
          },
        ],
      },
      {
        title: 'Keersommen',
        rows: [
          {
            entries: [
              {
                game: 'D',
                variant: 'ak',
                timeCode: 'a',
              },
              {
                game: 'AG',
                variant: 'ck',
                timeCode: 'a',
              },
            ],
          },
          {
            entries: [
              {
                game: 'D',
                variant: 'ak',
                timeCode: 'b',
              },
              {
                game: 'AG',
                variant: 'ck',
                timeCode: 'b',
              },
            ],
          },
        ],
      },
    ],
  };

  iconFunctions: Record<GameCode, RenderGameIconFunction> = {
    ...(Object.fromEntries(
      gameCodes.map(code => [code, renderNotImplemented]),
    ) as Record<GameCode, RenderGameIconFunction>),
    A: renderAdditionSubstractionWithinDecadeGameHourglassGameIcon,
    AG: renderMixedSumsGameHourglassGameIcon,
    R: renderSplitBalloonGameHourglassGameIcon,
    D: renderMultiplicationTablesBalloonHourglassGameIcon,
    G: renderSumsWithSplitGameHourglassGameIcon,
  };
}
