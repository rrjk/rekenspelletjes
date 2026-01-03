import { UnexpectedValueError } from './UnexpectedValueError';
import { svg, SVGTemplateResult } from 'lit';

export const edges = ['top', 'bottom', 'left', 'right'] as const;
export const directions = ['positive', 'negative'] as const;
export const puzzleBlobs = [...directions, 'straight'] as const;

export type Edge = (typeof edges)[number];
export type Direction = (typeof directions)[number];
export type PuzzleBlob = (typeof puzzleBlobs)[number];

export type PieceBlobDirections = Record<Edge, PuzzleBlob>;

const blobSizeFactor = 0.15; // Size of the blob as factor of the side size in the same direction as the blob

function directionToDirectionFactor(direction: Direction): -1 | 1 {
  switch (direction) {
    case 'positive':
      return 1;
    case 'negative':
      return -1;
    default:
      throw new UnexpectedValueError(direction);
  }
}

/** Provide a vertical edge path segment for a puzzle piece
 * @param edgeLength - length of the edge
 * @param blobSize - size of the blob
 * @param direction - direction of the edge (in the standard coordinate system)
 * @param blob - type of blob
 */
function pathVerticalEdgeSegment(
  edgeLength = 50,
  blobSize = 15,
  direction: Direction = 'positive',
  blob: PuzzleBlob = 'straight',
): string {
  if (blob === 'straight')
    return `l 0, ${directionToDirectionFactor(direction) * edgeLength}`;
  else {
    const curveCoordinates = {
      positive: [
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
      ],
      negative: [
        {
          dx1: 2.36,
          dy1: -10,
          dx2: -7.92,
          dy2: -26.67,
          dx: 7.08,
          dy: -20.32,
        },
        {
          dx1: 15,
          dy1: 3.65,
          dx2: 15,
          dy2: -16.35,
          dx: 0,
          dy: -10,
        },
        {
          dx1: -15,
          dy1: 6.34,
          dx2: -7.25,
          dy2: -9.68,
          dx: -7.08,
          dy: -19.68,
        },
      ],
    };
    // the curve coordinates as given above assume a positive direction and a positive direction blob

    const originalHeight = 50;
    const originalWidth = 15;

    const yFactor = edgeLength / originalHeight;
    const xFactor =
      (directionToDirectionFactor(blob) * blobSize) / originalWidth; // As we have rules out straight here, we can use directionToDirectionFactor

    let pathSegments = '';

    for (const curveSegment of curveCoordinates[direction]) {
      pathSegments =
        pathSegments.concat(` c${xFactor * curveSegment.dx1},${yFactor * curveSegment.dy1} ${xFactor * curveSegment.dx2},${yFactor * curveSegment.dy2} ${xFactor * curveSegment.dx},${yFactor * curveSegment.dy} 
    `);
    }
    return pathSegments;
  }
}

/** Provide a horizontal edge path segment for a puzzle piece
 * @param edgeLength - length of the edge
 * @param blobSize - size of the blob
 * @param direction - direction of the edge (in the standard coordinate system)
 * @param blob - type of blob
 */
function pathHorizontalEdgeSegment(
  edgeLength = 75,
  blobSize = 10,
  direction: Direction = 'positive',
  blob: PuzzleBlob = 'straight',
): string {
  if (blob === 'straight')
    return `l ${directionToDirectionFactor(direction) * edgeLength}, 0`;
  else {
    const curveCoordinates = {
      positive: [
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
      ],
      negative: [
        {
          dx1: -15,
          dy1: -0.29,
          dx2: -32.91,
          dy2: -6.25,
          dx: -27.81,
          dy: 3.75,
        },
        {
          dx1: 5.1,
          dy1: 10,
          dx2: -24.9,
          dy2: 10,
          dx: -15,
          dy: 0,
        },
        {
          dx1: 9.9,
          dy1: -10,
          dx2: -17.19,
          dy2: -2.24,
          dx: -32.19,
          dy: -3.75,
        },
      ],
    };
    // the curve coordinates as given above assume a positive direction and a positive direction blob

    const originalHeight = 10;
    const originalWidth = 75;

    const yFactor =
      (directionToDirectionFactor(blob) * blobSize) / originalHeight;
    const xFactor = edgeLength / originalWidth;

    let pathSegments = '';

    for (const curveSegment of curveCoordinates[direction]) {
      pathSegments =
        pathSegments.concat(` c${xFactor * curveSegment.dx1},${yFactor * curveSegment.dy1} ${xFactor * curveSegment.dx2},${yFactor * curveSegment.dy2} ${xFactor * curveSegment.dx},${yFactor * curveSegment.dy} 
    `);
    }
    return pathSegments;
  }
}

/** Provide a SVG path for a puzzle piece
 * @param x - X coordinate for the top left of the puzzl piece
 * @param y - Y coordinate for the top left of the puzzl piece
 * @param width - width of the puzzle piece
 * @param height - height of the puzzle piece
 * @param cls - class to apply to the path
 */
export function pathPuzzlePiece(
  x: number,
  y: number,
  width: number,
  height: number,
  blobDirections: PieceBlobDirections,
  cls = '',
): SVGTemplateResult {
  const blobSize = blobSizeFactor * Math.max(width, height);
  const sideSegments: string[] = [];
  sideSegments.push(
    pathVerticalEdgeSegment(height, blobSize, 'positive', blobDirections.left),
  );
  sideSegments.push(
    pathHorizontalEdgeSegment(
      width,
      blobSize,
      'positive',
      blobDirections.bottom,
    ),
  );
  sideSegments.push(
    pathVerticalEdgeSegment(height, blobSize, 'negative', blobDirections.right),
  );
  sideSegments.push(
    pathHorizontalEdgeSegment(width, blobSize, 'negative', blobDirections.top),
  );
  return svg`
      <path
        class=${cls}
        d="M${x},${y}
        ${sideSegments.join(' ')}
        z"
      ></path>
  `;
}
