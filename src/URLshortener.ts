const urlParams = new URLSearchParams(window.location.search);

const key = urlParams.keys().next().value;

const path = window.location.pathname;

console.log(path);

const root = `${window.location.protocol}//${window.location.host}`;
console.log(root);

const urls = [
  // a
  '../Rekenspelletjes/SommenMetSplitsen.html?game=split1Till20&plus&time=60',
  // b
  '../Rekenspelletjes/SommenMetSplitsen.html?game=split1Till20&plus&time=180',
];

function stringValue(a: string): number {
  let value = 0;
  const len = a.length;

  for (let position = 0; position < len; position++) {
    value += (a.charCodeAt(len - 1 - position) - 97) * 26 ** position;
  }
  return value;
}
if (key) {
  const index = stringValue(key);
  if (urls[index]) window.location.href = urls[index];
  else window.location.href = root;
} else window.location.href = root;
