const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.keys().next().value;

const baseUrl = new URL(`../Rekenspelletjes/`, import.meta.url);
const defaultUrl = new URL('./index.html', baseUrl);

const baseURLs: Partial<Record<string, URL>> = {
  D: new URL('./TafeltjesOefenenSpel.html', baseUrl),
};

const defaultTime = 60;
const timeCodes: Partial<Record<string, number>> = {
  a: defaultTime,
  b: 180,
  c: 300,
};

let newUrl = defaultUrl;

console.log({ key });

if (key) {
  const keyParts = key.split('-');

  const mainCode = keyParts[0];
  const variant = keyParts[1] || 'a';
  const time = timeCodes[keyParts[2]] || defaultTime;

  console.log({ mainCode, variant, time });

  newUrl = baseURLs[mainCode] || defaultUrl;
  console.log(`{newUrl}`);

  if (newUrl !== defaultUrl) {
    newUrl.searchParams.append('variant', variant);
    newUrl.searchParams.append('time', `${time}`);
  }
}
window.location.href = newUrl.href;
