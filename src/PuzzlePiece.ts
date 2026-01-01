import { Color, getColorInfo } from './Colors';
import { UnexpectedValueError } from './UnexpectedValueError';
import { svg, SVGTemplateResult } from 'lit';

type UpDown = 'up' | 'down';
type LeftRight = 'left' | 'right';
type InOutStraight = 'inwards' | 'outwards' | 'straight';

const blobSizeFactor = 0.15; // Size of the blob as factor of the side size in the same direction as the blob

/** Provide a straight vertical path segment for a puzzle piece
 * @param segmentLength - length of the segment
 * @param direction - direction of the vetical path segment
 */
export function pathVerticalSegmentStraight(
  segmentLength = 50,
  direction: UpDown = 'down',
): string {
  const directionFactor = direction === 'down' ? 1 : -1;
  return `l 0, ${directionFactor * segmentLength}`;
}

/** Provide a straight horizontal path segment for a puzzle piece
 * @param segmentLength - length of the segment
 * @param direction - direction of the vertical path segment
 */
export function pathHorizontalSegmentStraight(
  segmentLength = 50,
  direction: LeftRight = 'right',
): string {
  const directionFactor = direction === 'right' ? 1 : -1;
  return `l ${directionFactor * segmentLength}, 0`;
}

/** Provide a vertical path segment for a puzzle piece with a blob
 * @param segmentLength - length of the segment
 * @param blobSize - width of the blob
 * @param direction - direction of the vetical path segment
 * @param blob - direction of the blob
 */
export function pathVerticalSegmentBlob(
  segmentLength = 50,
  blobSize = 15,
  direction: UpDown = 'down',
  blob: LeftRight = 'right',
): string {
  const curveCoordinates = [
    {
      dx1: -0.17,
      dy1: 10,
      dx2: -7.92,
      dy2: 26.02,
      dx: 7.08,
      dy: 19.68,
    },
    {
      dx1: 15,
      dy1: -6.35,
      dx2: 15,
      dy2: 13.65,
      dx: 0,
      dy: 10,
    },
    {
      dx1: -15,
      dy1: -6.35,
      dx2: -4.72,
      dy2: 10.32,
      dx: -7.08,
      dy: 20.32,
    },
  ];

  const originalHeight = 50;
  const originalWidth = 15;
  const originalDirection: UpDown = 'down';
  const originalBlob: LeftRight = 'right';

  const directionFactor = originalDirection === direction ? 1 : -1;
  const blobFactor = originalBlob === blob ? 1 : -1;

  const yFactor = (directionFactor * segmentLength) / originalHeight;
  const xFactor = (blobFactor * blobSize) / originalWidth;

  let pathSegments = '';

  for (const curveSegment of curveCoordinates) {
    pathSegments =
      pathSegments.concat(` c${xFactor * curveSegment.dx1},${yFactor * curveSegment.dy1} ${xFactor * curveSegment.dx2},${yFactor * curveSegment.dy2} ${xFactor * curveSegment.dx},${yFactor * curveSegment.dy} 
    `);
  }
  return pathSegments;
}

/** Provide a horizontal path segment for a puzzle piece with a blob
 * @param segmentLength - length of the segment
 * @param blobSize - size of the blob
 * @param direction - direction of the vetical path segment
 * @param blob - direction of the blob
 */
export function pathHorizontalSegmentBlob(
  segmentLength = 75,
  blobSize = 10,
  direction: LeftRight = 'right',
  blob: UpDown = 'down',
): string {
  const curveCoordinates = [
    {
      dx1: 15,
      dy1: 1.51,
      dx2: 42.09,
      dy2: -6.25,
      dx: 32.19,
      dy: 3.75,
    },
    {
      dx1: -9.9,
      dy1: 10,
      dx2: 20.1,
      dy2: 10,
      dx: 15,
      dy: 0,
    },
    {
      dx1: -5.1,
      dy1: -10,
      dx2: 12.81,
      dy2: -4.04,
      dx: 27.81,
      dy: -3.75,
    },
  ];

  const originalHeight = 10;
  const originalWidth = 75;
  const originalDirection: LeftRight = 'right';
  const originalBlob: UpDown = 'down';

  const directionFactor = originalDirection === direction ? 1 : -1;
  const blobFactor = originalBlob === blob ? 1 : -1;

  const yFactor = (blobFactor * blobSize) / originalHeight;
  const xFactor = (directionFactor * segmentLength) / originalWidth;

  let pathSegments = '';

  for (const curveSegment of curveCoordinates) {
    pathSegments =
      pathSegments.concat(` c${xFactor * curveSegment.dx1},${yFactor * curveSegment.dy1} ${xFactor * curveSegment.dx2},${yFactor * curveSegment.dy2} ${xFactor * curveSegment.dx},${yFactor * curveSegment.dy} 
    `);
  }
  return pathSegments;
}

export function pathPuzzlePiece(
  x: number,
  y: number,
  width: number,
  height: number,
  blobDirections: InOutStraight[],
  fill: Color,
): SVGTemplateResult {
  const sideSegments: string[] = [];

  switch (
    blobDirections[0] // Left side of the puzzle piece
  ) {
    case 'straight':
      sideSegments.push(pathVerticalSegmentStraight(height, 'down'));
      break;
    case 'inwards':
    case 'outwards':
      sideSegments.push(
        pathVerticalSegmentBlob(
          height,
          blobSizeFactor * width,
          'down',
          blobDirections[0] === 'inwards' ? 'right' : 'left',
        ),
      );
      break;
    default:
      throw new UnexpectedValueError(blobDirections[0]);
  }

  switch (
    blobDirections[1] // Bottom side of the puzzle piece
  ) {
    case 'straight':
      sideSegments.push(pathHorizontalSegmentStraight(width, 'right'));
      break;
    case 'inwards':
    case 'outwards':
      sideSegments.push(
        pathHorizontalSegmentBlob(
          width,
          blobSizeFactor * width,
          'right',
          blobDirections[1] === 'inwards' ? 'up' : 'down',
        ),
      );
      break;
    default:
      throw new UnexpectedValueError(blobDirections[1]);
  }

  switch (
    blobDirections[2] // Right side of the puzzle piece
  ) {
    case 'straight':
      sideSegments.push(pathVerticalSegmentStraight(height, 'up'));
      break;
    case 'inwards':
    case 'outwards':
      sideSegments.push(
        pathVerticalSegmentBlob(
          height,
          blobSizeFactor * width,
          'up',
          blobDirections[2] === 'inwards' ? 'left' : 'right',
        ),
      );
      break;
    default:
      throw new UnexpectedValueError(blobDirections[2]);
  }

  switch (
    blobDirections[3] // Top side of the puzzle piece
  ) {
    case 'straight':
      sideSegments.push(pathHorizontalSegmentStraight(width, 'left'));
      break;
    case 'inwards':
    case 'outwards':
      sideSegments.push(
        pathHorizontalSegmentBlob(
          width,
          blobSizeFactor * width,
          'left',
          blobDirections[3] === 'inwards' ? 'down' : 'up',
        ),
      );
      break;
    default:
      throw new UnexpectedValueError(blobDirections[3]);
  }

  return svg`
      <path
        fill=${getColorInfo(fill).mainColorCode}
        d="M${x},${y}
        ${sideSegments.join(' ')}
        z"
      ></path>
  `;
}
