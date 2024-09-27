const urlParams = new URLSearchParams(window.location.search);

const key = urlParams.keys().next().value;

const root = `../Rekenspelletjes/index.html`;

const urls = [
  // a
  '../Rekenspelletjes/SommenMetSplitsen.html?game=split1Till20&plus&time=60',
  // b
  '../Rekenspelletjes/SommenMetSplitsen.html?game=split1Till20&plus&time=180',
  // c
  '../Rekenspelletjes/WelkeHandHeeftMeerStippen.html?countOnly=true&time=60',
  // d
  '../Rekenspelletjes/WelkeHandHeeftMeerStippen.html?countOnly=true&time=180',
  // e
  '../Rekenspelletjes/WelkeHandHeeftMeerStippen.html?includeDifference=false&time=60',
  // f
  '../Rekenspelletjes/WelkeHandHeeftMeerStippen.html?includeDifference=false&time=180',
  // g
  '../Rekenspelletjes/WelkeHandHeeftMeerStippen.html?includeDifference=true&time=60',
  // h
  '../Rekenspelletjes/WelkeHandHeeftMeerStippen.html?includeDifference=true&time=180',
];

function stringValue(a: string): number {
  console.log(`stringValue in = ${a}`);
  let value = 0;
  const len = a.length;

  for (let position = 0; position < len; position++) {
    value += (a.charCodeAt(len - 1 - position) - 97) * 26 ** position;
  }

  console.log(`index = ${value}`);
  return value;
}
if (key) {
  const index = stringValue(key);
  if (urls[index]) window.location.href = urls[index];
  else window.location.href = root;
} else window.location.href = root;
