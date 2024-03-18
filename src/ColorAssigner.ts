import { Color } from './Colors';
import { shuffleArray } from './Randomizer';

type Coordinate = { x: number; y: number };

type ColorLocationArray = { color: Color; coordinates: Coordinate[] }[];
type NumberColorLocationArray = {
  nmbr: number;
  color: Color;
  coordinates: Coordinate[];
}[];

export class ColorAssigner {
  colorMatrix: Color[][] = [[]];
  digitMatrix: number[][] = [[]];
  numberQuestions = 10;

  calculateNumberAssignment() {
    // Loop through colorMatrix to determine how many of each color we have

    const colorLocations: ColorLocationArray = [];
    const nmbrColorLocations: NumberColorLocationArray = [];

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

    console.log(JSON.stringify(colorLocations));

    for (const colorLocation of colorLocations) {
      shuffleArray(colorLocation.coordinates);
    }
    console.log(JSON.stringify(colorLocations));

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

    let nextQuestionNumber = 1;
    for (const colorLocation of colorLocations) {
      console.log(`color: ${colorLocation.color}`);
      const numberQuestionsForColor = Math.max(
        1,
        Math.floor(
          (colorLocation.coordinates.length - 1) /
            averageNumberBlocksPerFreeQuestion
        )
      );
      console.log(`nmbrQuestionsForColor = ${numberQuestionsForColor}`);

      const numberCoordinatesPerQuestion = Math.floor(
        colorLocation.coordinates.length / numberQuestionsForColor
      );
      for (let i = 0; i < numberQuestionsForColor; i++) {
        const coordinatesForQuestion = [];

        for (let j = 0; j < numberCoordinatesPerQuestion; j++) {
          const coordinate = colorLocation.coordinates.pop();
          if (coordinate === undefined)
            throw new Error(
              'Internal SW error, more coordinates expected but none found'
            );
          coordinatesForQuestion.push(coordinate);
        }

        nmbrColorLocations.push({
          nmbr: nextQuestionNumber,
          color: colorLocation.color,
          coordinates: coordinatesForQuestion,
        });
        nextQuestionNumber += 1;
      }
    }

    console.log(JSON.stringify(colorLocations));
    console.log(JSON.stringify(nmbrColorLocations));
    console.log(numberFreeQuestions);
    console.log(numberBlocks);
    console.log(averageNumberBlocksPerFreeQuestion);
  }
}
