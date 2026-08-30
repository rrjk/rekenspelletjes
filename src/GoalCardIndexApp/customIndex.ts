import { customElement } from 'lit/decorators.js';

import { GoalCardIndexApp } from './GoalCardIndexApp';

import { renderMixedSumsGameHourglassGameIcon } from '../MixedSumsGame/MixedSumsHourglassGameIcon';
import { renderAdditionSubstractionWithinDecadeGameHourglassGameIcon } from '../AdditionSubstractionWithinDecadeGame/AdditionSubstractionWithinDecadeGameHourglassGameIcon';
import {
  RenderGameIconFunction,
  renderNotImplemented,
} from '../RenderGameIconFunction';
import { renderSplitBalloonGameHourglassGameIcon } from '../SplitBalloonGame/SplitBalloonGameHourglassGameIcon';
import { renderSumsWithSplitGameHourglassGameIcon } from '../SumsWithSplitGame/SumsWithSplitGameHourglassGameIcon';
import { renderMultiplicationTablesBalloonHourglassGameIcon } from '../MultiplicationTablesBalloonGame/MultiplicationTablesBalloonHourglassGameIcon';
import { GameCode, gameCodes } from '../GameCodes';
import { decodeSectionInfoList } from './SectionInfoType';

@customElement('custom-index-app')
export class CustomIndexApp extends GoalCardIndexApp {
  // private parsedSections: IndexPage<GameCode> = { defaultPage: [] };

  parseUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedSectionInfoList = urlParams.get('d');
    this.sections = {
      defaultPage: decodeSectionInfoList(encodedSectionInfoList ?? ''),
    };
  }

  constructor() {
    super();
    this.parseUrlParameters();
  }

  get pageTitle(): string {
    return `Doelenkaart`;
  }

  iconFunctions: Record<GameCode, RenderGameIconFunction> = {
    ...(Object.fromEntries(
      gameCodes.map(code => [code, renderNotImplemented]),
    ) as Record<GameCode, RenderGameIconFunction>),
    A: renderAdditionSubstractionWithinDecadeGameHourglassGameIcon,
    AG: renderMixedSumsGameHourglassGameIcon,
    AE: renderMixedSumsGameHourglassGameIcon,
    R: renderSplitBalloonGameHourglassGameIcon,
    G: renderSumsWithSplitGameHourglassGameIcon,
    D: renderMultiplicationTablesBalloonHourglassGameIcon,
  };
}
