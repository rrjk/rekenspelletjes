import { Color } from './Colors';
import { shuffleArray } from './Randomizer';

type Coordinate = { x: number; y: number };

type ColorLocationArray = { color: Color; coordinates: Coordinate[] }[];

export class ColorAssigner {
  colorMatrix: Color[][] = [[]];
  digitMatrix: number[][] = [[]];
  numberQuestions = 8;

  calculateNumberAssignment() {
    // Loop through colorMatrix to determine how many of each color we have

    const colorLocations: ColorLocationArray = [];

    for (let x = 0; x < this.colorMatrix[0].length; x++) {
      for (let y = 0; y < this.colorMatrix.length; y++) {
        const color: Color = this.colorMatrix[x][y];
        let colorLocation = colorLocations.find(cl => cl.color === color);
        if (colorLocation === undefined) {
          colorLocation = { color, coordinates: [] };
          colorLocations.push(colorLocation);
        }
        colorLocation.coordinates.push({ x, y });
      }
    }

    console.log(colorLocations);

    for (const colorLocation of colorLocations) {
      console.log(colorLocation);
      shuffleArray(colorLocation.coordinates);
      console.log(colorLocation);
    }

    const numberColors = colorLocations.length;
    if (numberColors > this.numberQuestions)
      throw new Error('More colors than questions');

    const numberFreeQuestions = this.numberQuestions - numberColors;
    const numberBlocks = colorLocations.reduce(
      (nmbr, elm) => nmbr + elm.coordinates.length,
      0
    );

    const averageNumberBlocksPerFreeQuestion =
      (numberBlocks - numberColors) / numberFreeQuestions;

    console.log(colorLocations);
    console.log(numberFreeQuestions);
    console.log(numberBlocks);
    console.log(averageNumberBlocksPerFreeQuestion);

    const array = [{ x: 0 }, { x: 1 }, 2, { x: 3 }, 4, { x: 5 }, 6];
    console.log(array);
    shuffleArray(array);
    console.log(array);
  }
}
