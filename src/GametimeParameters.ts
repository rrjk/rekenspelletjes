export function ParseGametimeFromUrl(defaultGametime = 60): number {
  const urlParams = new URLSearchParams(window.location.search);
  let time = defaultGametime;

  if (urlParams.has('time')) {
    time = parseInt(urlParams.get('time') || '', 10);
    if (!time || time <= 0) {
      time = defaultGametime;
    }
  }

  return time;
}
