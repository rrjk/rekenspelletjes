import { timeCodeMapping, isTimeCode } from './TimeCodes';
import { isGameCode, type GameCode } from './GameCodes';

const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.keys().next().value;

const baseUrl = new URL('./Rekenspelletjes/', window.location.origin);

const defaultUrl = new URL('./index.html', baseUrl);

const baseURLs: Partial<Record<GameCode, URL>> = {
  A: new URL('./PlusMinBinnenTiental.html', baseUrl),
  B: new URL('./PlusMinHeleTientallen.html', baseUrl),
  C: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  D: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  E: new URL('./Sorteren.html', baseUrl),
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
export function urlToGameInfo(url: URL): {
  gameCode: GameCode | null;
  variant: string;
  timeCode?: string;
} {
  const matchingKey = Object.entries(baseURLs).find(
    ([, base]) => base && url.href.startsWith(base.href),
  )?.[0];

  const gameCode = matchingKey && isGameCode(matchingKey) ? matchingKey : null;

  const variant = url.searchParams.get('variant') || 'a';

  const time = url.searchParams.get('time');
  const timeCode = time
    ? Object.entries(timeCodeMapping).find(
        ([, value]) => `${value}` === time,
      )?.[0]
    : undefined;

  return { gameCode, variant, timeCode };
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
