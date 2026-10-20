import { renderAdditionSubstractionWholeDecadeGameHourglassGameIcon } from './AdditionSubstractionWholeDecadeGame/AdditionSubstractionWholeDecadeGameHourglassGameIcon';
import { renderAdditionSubstractionWithinDecadeGameHourglassGameIcon } from './AdditionSubstractionWithinDecadeGame/AdditionSubstractionWithinDecadeGameHourglassGameIcon';
import { renderClickInOrderGameHourglassGameIcon } from './ClickInOrderGame/ClickInOrderHourglassGameIcon';
import { renderClickTheRightPhotoOnNumberLineHourglassGameIcon } from './ClickTheRightPhotoOnNumberLineGame/ClickTheRightPhotoOnNumberLineHourglassGameIcon';
import { renderCombineToSolveSumGameHourglassGameIcon } from './CombineToSolveSumGame/CombineToSolveSumGameHourglassGameIcon';
import { renderDieFaceGameHourglassGameIcon } from './DieFaceGame/DieFaceGameHourglassGameIcon';
import { renderDivisionWithSplitGameHourglassGameIcon } from './DivideWithSplitGame/DivisionWithSplitGameHourglassGameIcon';
import { renderDotCountingGameHourglassGameIcon } from './DotCountingGame/DotCountingGameHourglassGameIcon';
import { renderEggCountingGameHourglassGameIcon } from './EggCounting/EggCountingGameHourglassGameIcon';
import { renderFractionsPairMatchingGameHourglassGameIcon } from './FractionsPairMatchingGame/FractionsPairMatchingGameHourglassGameIcon';
import { renderHowManyFingersGameHourglassGameIcon } from './HowManyFingersGame/HowManyFingersHourglassGameIcon';
import { renderJumpOnNumberLineHourglassGameIcon } from './JumpOnNumberLineGame/JumpOnNumberLineHourglassGameIcon';
import { renderMixedSumsGameHourglassGameIcon } from './MixedSumsGame/MixedSumsHourglassGameIcon';
import { renderMultiplicationTablesBalloonHourglassGameIcon } from './MultiplicationTablesBalloonGame/MultiplicationTablesBalloonHourglassGameIcon';
import { renderNumberlineArchesGameHourglassGameIcon } from './NumberlineArchesGame/NumberlineArchesGameHourglassGameIcon';
import { renderSortingGameHourglassGameIcon } from './SortingGame/SortingGameHourglassGameIcon';
import { renderSplitBalloonGameHourglassGameIcon } from './SplitBalloonGame/SplitBalloonGameHourglassGameIcon';
import { renderSumsWithSplitGameHourglassGameIcon } from './SumsWithSplitGame/SumsWithSplitGameHourglassGameIcon';
import { renderTensSplitGameHourglassGameIcon } from './TensSplitGame/TensSplitGameHourglassGameIcon';

import { GameCode } from './GameCodes';
import {
  RenderGameIconFunction,
  renderNotImplemented,
} from './RenderGameIconFunction';

/** Indication whether a game is time based or not per game code. */
export const timeBasedGame: Record<GameCode, boolean> = {
  A: true,
  B: true,
  C: true,
  D: true,
  E: true,
  F: false, // No shorturl for F NOT IMPLEMENTED
  G: true,
  H: false,
  I: true,
  J: true,
  K: true,
  L: false, // No shorturl for L NOT IMPLEMENTED
  M: true,
  N: false,
  O: true,
  P: false,
  Q: false,
  R: true,
  S: true,
  T: true,
  U: true,
  V: true,
  W: true,
  X: true,
  Y: false, // No shorturl for Y NOT IMPLEMENTED
  Z: true,
  AA: true,
  AB: true,
  AC: true,
  AD: true,
  AE: true,
  AF: true,
  AG: true,
};

const iconFunctions: Record<GameCode, RenderGameIconFunction> = {
  A: renderAdditionSubstractionWithinDecadeGameHourglassGameIcon,
  B: renderAdditionSubstractionWholeDecadeGameHourglassGameIcon,
  C: renderMultiplicationTablesBalloonHourglassGameIcon,
  D: renderMultiplicationTablesBalloonHourglassGameIcon,
  E: renderSortingGameHourglassGameIcon,
  F: renderNotImplemented, // No shorturl for F NOT IMPLEMENTED
  G: renderSumsWithSplitGameHourglassGameIcon,
  H: renderClickInOrderGameHourglassGameIcon,
  I: renderFractionsPairMatchingGameHourglassGameIcon,
  J: renderEggCountingGameHourglassGameIcon,
  K: renderMultiplicationTablesBalloonHourglassGameIcon,
  L: renderNotImplemented, // No shorturl for L NOT IMPLEMENTED
  M: renderMultiplicationTablesBalloonHourglassGameIcon,
  N: renderCombineToSolveSumGameHourglassGameIcon,
  O: renderDotCountingGameHourglassGameIcon,
  P: renderClickInOrderGameHourglassGameIcon,
  Q: renderClickInOrderGameHourglassGameIcon,
  R: renderSplitBalloonGameHourglassGameIcon,
  S: renderSortingGameHourglassGameIcon,
  T: renderClickTheRightPhotoOnNumberLineHourglassGameIcon,
  U: renderJumpOnNumberLineHourglassGameIcon,
  V: renderSumsWithSplitGameHourglassGameIcon,
  W: renderTensSplitGameHourglassGameIcon,
  X: renderNumberlineArchesGameHourglassGameIcon,
  Y: renderNotImplemented, // No shorturl for Y NOT IMPLEMENTED
  Z: renderDivisionWithSplitGameHourglassGameIcon,
  AA: renderDieFaceGameHourglassGameIcon,
  AB: renderHowManyFingersGameHourglassGameIcon,
  AC: renderMixedSumsGameHourglassGameIcon,
  AD: renderMixedSumsGameHourglassGameIcon,
  AE: renderMixedSumsGameHourglassGameIcon,
  AF: renderMixedSumsGameHourglassGameIcon,
  AG: renderMixedSumsGameHourglassGameIcon,
};

export function getIconRenderFunction(
  gameCode: GameCode,
): RenderGameIconFunction {
  return iconFunctions[gameCode];
}

export function iconRenderFunctionSupported(gameCode: GameCode) {
  return iconFunctions[gameCode] !== renderNotImplemented;
}
