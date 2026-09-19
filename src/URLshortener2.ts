import {
  timeCodeMapping,
  isTimeCode,
  TimeCode,
  stringToTimeCode,
} from './TimeCodes';
import { isGameCode, type GameCode } from './GameCodes';

const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.keys().next().value;

const baseUrl = new URL('./Rekenspelletjes/', window.location.origin);

const defaultUrl = new URL('./index.html', baseUrl);

export type GameInfo = {
  game: GameCode;
  variant: string;
  timeCode?: TimeCode;
};

const baseURLs: Partial<Record<GameCode, URL>> = {
  A: new URL('./PlusMinBinnenTiental.html', baseUrl),
  B: new URL('./PlusMinHeleTientallen.html', baseUrl),
  C: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  D: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  E: new URL('./Sorteren.html', baseUrl),
  // F not yet implemented for short urls with t
  G: new URL('./SommenMetSplitsen.html', baseUrl),
  H: new URL('./AanklikkenInVolgorde.html', baseUrl),
  I: new URL('./BreukenPaartjesSpel.html', baseUrl),
  J: new URL('./EierdoosTellen.html', baseUrl),
  K: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  M: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  N: new URL('./SomPaartjes.html', baseUrl),
  O: new URL('./StippenTellen.html', baseUrl),
  P: new URL('./AanklikkenInVolgorde.html', baseUrl),
  Q: new URL('./AanklikkenInVolgorde.html', baseUrl),
  R: new URL('./SplitsenV2.html', baseUrl),
  S: new URL('./Sorteren.html', baseUrl),
  T: new URL('./KlikFotoOpGetallenlijn.html', baseUrl),
  U: new URL('./SpringOpGetallenlijn.html', baseUrl),
  V: new URL('./SommenMetSplitsen.html', baseUrl),
  W: new URL('./SplitsenOpWaarde.html', baseUrl),
  X: new URL('./GetallenlijnBoogjesSpel.html', baseUrl),
  Z: new URL('./DelenMetSplitsen.html', baseUrl),
  AA: new URL('./DobbelsteenSpel.html', baseUrl),
  AB: new URL('./HoeveelVingersSpel.html', baseUrl),
  AC: new URL('./GemengdeSommen.html', baseUrl),
  AD: new URL('./GemengdeSommen.html', baseUrl),
  AE: new URL('./GemengdeSommen.html', baseUrl),
  AF: new URL('./GemengdeSommen.html', baseUrl),
  AG: new URL('./GemengdeSommen.html', baseUrl),
};

let newUrl = defaultUrl;

/**
 * Creates the game URL for a game code, variant, and optional time setting.
 *
 * @param gameCode The code identifying the game to open.
 * @param variant The game variant to include in the URL.
 * @param timeCode The optional time-code key to translate to seconds.
 * @returns The URL of the selected game with its query parameters.
 */
export function gameInfoToUrl(
  gameCode: GameCode,
  variant = 'a',
  timeCode?: string,
): URL {
  const base = baseURLs[gameCode] || defaultUrl;
  const url = new URL(base.href);
  url.searchParams.append('variant', variant);
  if (timeCode && isTimeCode(timeCode)) {
    url.searchParams.append('time', `${timeCodeMapping[timeCode]}`);
  }
  return url;
}

/**
 * Extracts game information from a game URL.
 *
 * When multiple game codes map to the same base URL, the first matching entry
 * in {@link baseURLs} is returned. The original game code cannot be recovered
 * from the URL alone in that case.
 *
 * @param url The game URL to inspect.
 * @returns The matching game code, variant, and optional time-code key.
 */
export function urlToGameInfo(url: URL): GameInfo | null {
  const matchingKey = Object.entries(baseURLs).find(
    ([, base]) => base && url.href.startsWith(base.href),
  )?.[0];

  const game = matchingKey && isGameCode(matchingKey) ? matchingKey : null;

  const variant = url.searchParams.get('variant') || 'a';

  const time = url.searchParams.get('time');
  const timeCode = stringToTimeCode(time);

  if (game === null) return null;
  return { game, variant, timeCode };
}

/**
 * Redirects a short-link URL to its corresponding game page.
 *
 * The first query parameter name is interpreted as a hyphen-separated game
 * code, variant, and optional time code. Invalid or missing game codes redirect
 * to the game index page.
 */
export function redirect() {
  if (key) {
    const keyParts = key.split('-');

    const mainCode = keyParts[0];
    const variant = keyParts[1] || 'a';
    const timeCode = keyParts[2] || undefined;

    if (isGameCode(mainCode))
      newUrl = gameInfoToUrl(mainCode, variant, timeCode);
  }
  window.location.replace(newUrl.href);
}

const SHORT_URL_CODE =
  /^(?<game>[A-Z]{1,2})-(?<variant>[a-z]{1,2})-(?<time>[a-z])\/?$/;

/**
 *   Extracts game information from a game URL.
 *
 * @param url - URL to extract gameinfo from
 * @returns gameInfo contained in the URL or null if the URL is not a valid short URL
 */
export function shortUrlToGameInfo(url: URL): GameInfo | null {
  if (url.pathname !== '/t') return null;
  const groups = SHORT_URL_CODE.exec(url.search.slice(1))?.groups;
  if (!groups) return null;
  const game = groups.game;
  const variant = groups.variant;
  const timeCode = groups.time;

  if (!isGameCode(game) || !isTimeCode(timeCode)) return null;
  return { game, variant, timeCode };
}

/**
 *   Extracts game information from a game URL.
 *
 * @param gameInfo Game info for the URL to create
 * @returns The short URL of the selected game.
 */
export function gameInfoToShortUrl(gameInfo: GameInfo): URL {
  return new URL(
    `./t?${gameInfo.game}-${gameInfo.variant}-${gameInfo.timeCode}/`,
    window.location.origin,
  );
}

/** Determine whether an URL is a valid short URL.
 * @param url - URL to check
 * @return URL is a valid short URL.
 */
export function isValidShortUrl(url: URL): boolean {
  return shortUrlToGameInfo(url) !== null;
}
