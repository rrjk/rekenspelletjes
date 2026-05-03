import {
  timeCodeMapping,
  defaultTime,
  //  timeCodes,
  isTimeCode,
} from './TimeCodes';

const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.keys().next().value;

const baseUrl = new URL('./Rekenspelletjes/', window.location.origin);

const defaultUrl = new URL('./index.html', baseUrl);

const baseURLs: Partial<Record<string, URL>> = {
  A: new URL('./PlusMinBinnenTiental.html', baseUrl),
  AA: new URL('./DobbelsteenSpel.html', baseUrl),
  B: new URL('./PlusMinHeleTientallen.html', baseUrl),
  C: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  D: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  E: new URL('./Sorteren.html', baseUrl),
  I: new URL('./BreukenPaartjesSpel.html', baseUrl),
  J: new URL('./EierdoosTellen.html', baseUrl),
  K: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  M: new URL('./TafeltjesOefenenSpel.html', baseUrl),
  O: new URL('./StippenTellen.html', baseUrl),
  R: new URL('./SplitsenV2.html', baseUrl),
  S: new URL('./Sorteren.html', baseUrl),
  X: new URL('./GetallenlijnBoogjesSpel.html', baseUrl),
  AB: new URL('./HoeveelVingersSpel.html', baseUrl),
  AC: new URL('./GemengdeSommen.html', baseUrl),
  AD: new URL('./GemengdeSommen.html', baseUrl),
};

let newUrl = defaultUrl;

if (key) {
  const keyParts = key.split('-');

  const mainCode = keyParts[0];
  const variant = keyParts[1] || 'a';
  const timeCode = keyParts[2] || '';
  let time = defaultTime;
  if (isTimeCode(timeCode)) time = timeCodeMapping[timeCode];

  newUrl = baseURLs[mainCode] || defaultUrl;

  if (newUrl !== defaultUrl) {
    newUrl.searchParams.append('variant', variant);
    newUrl.searchParams.append('time', `${time}`);
  }
}
window.location.href = newUrl.href;
