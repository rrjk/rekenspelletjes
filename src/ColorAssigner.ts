import { Color } from './Colors';
import { shuffleArray } from './Randomizer';
import { rangeFromTo } from './UtilityFunctions';

type Coordinate = { x: number; y: number };

type ColorLocationArray = {
  color: Color;
  questionIds: number[];
  fractionQuestionsLeft: number;
  coordinates: Coordinate[];
}[];

type QuestionInfo = {
  questionNumber: number;
  question: string;
  blockCoordinates: Coordinate[];
  color: Color;
};

function determineShuffledLocationsPerColor(
  colorMatrix: Color[][]
): ColorLocationArray {
  const colorLocations: ColorLocationArray = [];

  for (let x = 0; x < colorMatrix[0].length; x++) {
    for (let y = 0; y < colorMatrix.length; y++) {
      const color: Color = colorMatrix[x][y];
      let colorLocation = colorLocations.find(cl => cl.color === color);
      if (colorLocation === undefined) {
        colorLocation = {
          color,
          questionIds: [],
          fractionQuestionsLeft: 0,
          coordinates: [],
        };
        colorLocations.push(colorLocation);
      }
      colorLocation.coordinates.push({ x, y });
    }
  }

  for (const colorLocation of colorLocations) {
    shuffleArray(colorLocation.coordinates);
  }

  return colorLocations;
}

function determineNumberColors(colorLocations: ColorLocationArray): number {
  return colorLocations.length;
}

function determineNumberCoordinates(
  colorLocations: ColorLocationArray
): number {
  return colorLocations.reduce((nmbr, elm) => nmbr + elm.coordinates.length, 0);
}

/** Determine the number of blocks that are needed per free question.
 * Each color needs at least one question. Based on the mean number of coordinates per block however, some colors might never get a question.
 * That is obviously undesired, so each color gets at least one question.
 *
 * Each question that gets assigned to a color, even without sufficien coordinates, is a non-free question.
 * All other questions are free question.
 *
 * This function determines how many coordinates we'll have per free question.
 *
 * @param colorLocations - array with the locations per color
 * @param numberQuestion - number of questions to work with
 */
function determineBlocksPerFreeQuestion(
  colorLocations: ColorLocationArray,
  numberQuestions: number
): number {
  const numberColors = determineNumberColors(colorLocations);
  const numberCoordinates = determineNumberCoordinates(colorLocations);
  if (numberColors > numberQuestions)
    throw new Error('More colors than questions');

  const initialMeanBlocksPerQuestion = numberCoordinates / numberQuestions;

  let numberAffectedColors = 0;
  let numberAffectedCoordinates = 0;
  for (const colorLocation of colorLocations) {
    if (colorLocation.coordinates.length < initialMeanBlocksPerQuestion) {
      numberAffectedColors += 1;
      numberAffectedCoordinates += colorLocation.coordinates.length;
    }
  }

  const meanBlocksPerFreeQuestion =
    (numberCoordinates - numberAffectedCoordinates) /
    (numberQuestions - numberAffectedColors);

  return meanBlocksPerFreeQuestion;
}

/** Assign the initial number of questions per color
 *
 * Each color is always assigned at least one question.
 * Furthermore, a color is assigned a question for each ceil(coordinatesPerQuestion)
 * The fraction of questions needed to fill all coordinates is then written to colorLocations
 *
 * @param colorLocations - array with all colors location and question information- will be updated
 * @param coordinatesPerQuestion - number of coordinates that need to be assigned per question, may be a non-integer
 * @param availableQuestions - array with available question numbers - will be updated to reflect used questions
 *
 */
function assignInitialQuestions(
  colorLocations: ColorLocationArray,
  coordinatesPerQuestion: number,
  availableQuestions: number[]
) {
  for (const colorLocation of colorLocations) {
    const numberQuestionsForColor =
      colorLocation.coordinates.length / coordinatesPerQuestion;
    for (let i = 0; i < Math.max(1, Math.floor(numberQuestionsForColor)); i++) {
      const nextQuestion = availableQuestions.pop();
      if (nextQuestion === undefined)
        throw new Error('Internal SW error, insufficient questions');
      colorLocation.questionIds.push(nextQuestion);
    }
    colorLocation.fractionQuestionsLeft =
      numberQuestionsForColor - Math.floor(numberQuestionsForColor);
  }
}

/** Assign remaining questions over the colors
 *
 * @param colorLocations - array with all colors location and question information- will be updated
 * @param availableQuestions - array with available question numbers - will be updated to reflect used questions
 *
 */
function assignRemainingQuestions(
  colorLocations: ColorLocationArray,
  availableQuestions: number[]
) {
  let colorLocationCounter = 0;

  while (availableQuestions.length > 0) {
    if (colorLocationCounter >= colorLocations.length)
      throw new Error('Internal SW error, insufficient color locations');
    if (
      colorLocations[colorLocationCounter].questionIds.length >=
      colorLocations[colorLocationCounter].coordinates.length
    )
      throw new Error('Internal SW error, insufficient color locations');

    colorLocations[colorLocationCounter].questionIds.push(
      <number>availableQuestions.pop()
    ); // Due to while loop we know pop will succeed
    colorLocationCounter += 1;
  }
}

/** Assign, per color, coordinates to the questions and return a sorted question array
 *
 * @param colorLocations - color location array - not updated
 * @returns array with questions, their number, color and coordinates for the question
 */
function assignCoordinatesToQuestions(
  colorLocations: ColorLocationArray
): QuestionInfo[] {
  const questions: QuestionInfo[] = [];
  for (const colorLocation of colorLocations) {
    let nmbrQuestionsleft = colorLocation.questionIds.length;
    let nmbrCoordinatesLeft = colorLocation.coordinates.length;
    for (const question of colorLocation.questionIds) {
      if (nmbrQuestionsleft < 1 || nmbrCoordinatesLeft < 1) {
        throw Error(
          'Internal SW error: no more questions or coordinates left while there should be.'
        );
      }
      const coordinatesToUse = Math.round(
        nmbrCoordinatesLeft / nmbrQuestionsleft
      );
      questions.push({
        question: '',
        questionNumber: question,
        color: colorLocation.color,
        blockCoordinates: colorLocation.coordinates.splice(0, coordinatesToUse),
      });
      nmbrQuestionsleft -= 1;
      nmbrCoordinatesLeft -= coordinatesToUse;
    }
  }
  questions.sort((a, b) => a.questionNumber - b.questionNumber);
  return questions;
}

export function calculateQuestionAssignment(
  colorMatrix: Color[][],
  numberQuestions: number
): QuestionInfo[] {
  const colorLocations: ColorLocationArray =
    determineShuffledLocationsPerColor(colorMatrix);

  const meanBlocksPerFreeQuestion = determineBlocksPerFreeQuestion(
    colorLocations,
    numberQuestions
  );

  const availableQuestions = rangeFromTo(1, numberQuestions);
  shuffleArray(availableQuestions);

  assignInitialQuestions(
    colorLocations,
    meanBlocksPerFreeQuestion,
    availableQuestions
  );

  // Make sure the colors with the highest fractionQuestionsLeft appear on top.
  colorLocations.sort(
    (a, b) => b.fractionQuestionsLeft - a.fractionQuestionsLeft
  );

  assignRemainingQuestions(colorLocations, availableQuestions);

  return assignCoordinatesToQuestions(colorLocations);
}
