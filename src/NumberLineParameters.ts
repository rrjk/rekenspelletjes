export interface NumberLineParameters {
  /** Minimum value for the numberline, always a multiple of 10 */
  readonly minimum: number;
  /** Maximum value for the numberline, always a multiple of 10 */
  readonly maximum: number;
  /** Show tickmarks for each multipe of 10 */
  readonly show10TickMarks: boolean;
  /** Show tickmarks for each multipe of 5 */
  readonly show5TickMarks: boolean;
  /** Show tickmarks for each invidiual number */
  readonly show1TickMarks: boolean;
  /** Show all multiple of 10 numbers */
  readonly showAll10Numbers: boolean;
}

export function ParseNumberLineParameters(): NumberLineParameters {
  const urlParams = new URLSearchParams(window.location.search);

  let minimum = 0;
  let maximum = 100;
  let show10TickMarks = true;
  let show5TickMarks = false;
  let show1TickMarks = false;
  let showAll10Numbers = false;

  if (urlParams.has('minimum')) {
    const r = parseInt(urlParams.get('minimum') || '', 10);
    if (r % 10 === 0) {
      minimum = r;
    }
  }

  if (urlParams.has('maximum')) {
    const r = parseInt(urlParams.get('maximum') || '', 10);
    if (r % 10 === 0) {
      maximum = r;
    }
  }

  if (urlParams.has('show10TickMarks')) {
    show10TickMarks = true;
  } else if (urlParams.has('hide10TickMarks')) {
    show10TickMarks = false;
  }
  if (urlParams.has('show5TickMarks')) {
    show5TickMarks = true;
  } else if (urlParams.has('hide5TickMarks')) {
    show5TickMarks = false;
  }
  if (urlParams.has('show1TickMarks')) {
    show1TickMarks = true;
  } else if (urlParams.has('hide1TickMarks')) {
    show1TickMarks = false;
  }

  if (urlParams.has('showAll10Numbers')) {
    showAll10Numbers = true;
  } else if (urlParams.has('hideAll10Numbers')) {
    showAll10Numbers = false;
  }

  return {
    minimum,
    maximum,
    show10TickMarks,
    show5TickMarks,
    show1TickMarks,
    showAll10Numbers,
  };
}
