interface NumberSequenceConfig {
  start: number | 'random';
  nmbrBalls: number;
  direction: 'ascending' | 'descending';
  numberType: 'all' | 'even' | 'odd';
}

interface MultiplicationConfig {
  tableOfMultiplication: number[];
  nmbrBalls: number;
  showSum: boolean;
  iconColorPermutation: number; // Index into ballColorPermutations array
}

// Discriminated union for variant info
export type ClickInOrderGameVariantInfo =
  | {
      gameType: 'numberSequence';
      numberSequenceConfig: NumberSequenceConfig;
    }
  | {
      gameType: 'multiplicationTable';
      multiplicationConfig: MultiplicationConfig;
    }
  | {
      gameType: 'multiplicationWithSum';
      multiplicationConfig: MultiplicationConfig;
    };

// Basic Number Sequences (aa-ah) - Main Code H
export const clickInOrderGameVariants: Record<
  string,
  ClickInOrderGameVariantInfo
> = {
  // Section 1: Basic Number Sequences
  aa: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 1,
      nmbrBalls: 10,
      direction: 'ascending',
      numberType: 'all',
    },
  },
  ab: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 11,
      nmbrBalls: 10,
      direction: 'ascending',
      numberType: 'all',
    },
  },
  ac: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 1,
      nmbrBalls: 20,
      direction: 'ascending',
      numberType: 'all',
    },
  },
  ad: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 11,
      nmbrBalls: 20,
      direction: 'ascending',
      numberType: 'all',
    },
  },
  ae: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 21,
      nmbrBalls: 20,
      direction: 'ascending',
      numberType: 'all',
    },
  },
  af: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 31,
      nmbrBalls: 20,
      direction: 'ascending',
      numberType: 'all',
    },
  },
  ag: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 1,
      nmbrBalls: 50,
      direction: 'ascending',
      numberType: 'all',
    },
  },
  ah: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 20,
      nmbrBalls: 20,
      direction: 'descending',
      numberType: 'all',
    },
  },

  // Section 2: Special Number Types
  ba: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 'random',
      nmbrBalls: 20,
      direction: 'ascending',
      numberType: 'all',
    },
  },
  bb: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 2,
      nmbrBalls: 10,
      direction: 'ascending',
      numberType: 'even',
    },
  },
  bc: {
    gameType: 'numberSequence',
    numberSequenceConfig: {
      start: 1,
      nmbrBalls: 10,
      direction: 'ascending',
      numberType: 'odd',
    },
  },

  // Section 3: Multiplication Tables (ca-ch) - Main Code P
  ca: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [10],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 1,
    },
  },
  cb: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [2],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 6,
    },
  },
  cc: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [5],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 13,
    },
  },
  cd: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [3],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 20,
    },
  },
  ce: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [4],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 3,
    },
  },
  cf: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [6],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 11,
    },
  },
  cg: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [7],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 13,
    },
  },
  ch: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [8],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 20,
    },
  },
  ci: {
    gameType: 'multiplicationTable',
    multiplicationConfig: {
      tableOfMultiplication: [9],
      nmbrBalls: 10,
      showSum: false,
      iconColorPermutation: 5,
    },
  },

  // Section 4: Multiplication with Sums (da-dk) - Main Code Q
  da: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [2],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 1,
    },
  },
  db: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [5],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 6,
    },
  },
  dc: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [10],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 13,
    },
  },
  dd: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [3],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 20,
    },
  },
  de: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [4],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 3,
    },
  },
  df: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [2, 3, 4, 5, 10],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 11,
    },
  },
  dg: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [6],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 13,
    },
  },
  dh: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [7],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 20,
    },
  },
  di: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [8],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 5,
    },
  },
  dj: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [9],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 19,
    },
  },
  dk: {
    gameType: 'multiplicationWithSum',
    multiplicationConfig: {
      tableOfMultiplication: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      nmbrBalls: 10,
      showSum: true,
      iconColorPermutation: 14,
    },
  },
};

// Export types for external use
import { UnexpectedValueError } from '../UnexpectedValueError';
import { joinWithEn } from '../Utils';

export type ClickInOrderGameExtendedVariantInfo =
  ClickInOrderGameVariantInfo & {
    mainCode: string;
    description: string;
    iconText: string;
  };

function determineMainCode(variantInfo: ClickInOrderGameVariantInfo): string {
  switch (variantInfo.gameType) {
    case 'numberSequence':
      return 'H';
    case 'multiplicationTable':
      return 'P';
    case 'multiplicationWithSum':
      return 'Q';
    default:
      throw new UnexpectedValueError(variantInfo);
  }
}

function createDescription(variantInfo: ClickInOrderGameVariantInfo): string {
  switch (variantInfo.gameType) {
    case 'numberSequence': {
      const config = variantInfo.numberSequenceConfig;

      if (typeof config.start === 'number') {
        const directionText =
          config.direction === 'ascending' ? 'Oplopende' : 'Aflopende';
        const firstNumberText = `${config.start}`;
        const multiplier = config.numberType === 'all' ? 1 : 2;
        const directionMultiplier = config.direction === 'ascending' ? 1 : -1;
        const lastNumberText = `${config.start + (config.nmbrBalls - 1) * multiplier * directionMultiplier}`;
        let eventOddText = '';
        switch (config.numberType) {
          case 'all':
            eventOddText = '';
            break;
          case 'even':
            eventOddText = 'van alle even getallen ';
            break;
          case 'odd':
            eventOddText = 'van alle oneven getallen ';
            break;
          default:
            throw new UnexpectedValueError(config.numberType);
        }
        return `${directionText} getallenrij ${eventOddText}van ${firstNumberText} t/m ${lastNumberText}.`;
      } else if (config.start === 'random') {
        const directionText =
          config.direction === 'ascending' ? 'Oplopende' : 'Aflopende';
        let evenOddText = '';
        switch (config.numberType) {
          case 'all':
            evenOddText = '';
            break;
          case 'even':
            evenOddText = 'even ';
            break;
          case 'odd':
            evenOddText = 'oneven ';
            break;
          default:
            throw new UnexpectedValueError(config.numberType);
        }
        return `${directionText} getallenrij van ${config.nmbrBalls} ${evenOddText}getallen, startend bij een willekeurig getal.`;
      } else {
        throw new UnexpectedValueError(config.start);
      }
    }

    case 'multiplicationTable':
    case 'multiplicationWithSum': {
      const config = variantInfo.multiplicationConfig;
      if (config.showSum) {
        if (config.tableOfMultiplication.length === 1) {
          return `Kies het juiste getal bij de keersommen van de tafel van ${config.tableOfMultiplication[0]}.`;
        }
        return `Kies het juiste getal bij de keersommen van de tafels van ${joinWithEn(config.tableOfMultiplication)}.`;
      } else {
        return `Klik de getallen aan, van klein naar groot, met sprongen van ${config.tableOfMultiplication[0]}.`;
      }
    }
    default:
      throw new UnexpectedValueError(variantInfo);
  }
}

function createIconText(variantInfo: ClickInOrderGameVariantInfo): string {
  switch (variantInfo.gameType) {
    case 'numberSequence': {
      const config = variantInfo.numberSequenceConfig;
      if (config.start === 'random') {
        return 'Random';
      }
      return `${config.start}`;
    }
    case 'multiplicationTable': {
      const config = variantInfo.multiplicationConfig;
      return config.tableOfMultiplication[0].toString();
    }
    case 'multiplicationWithSum': {
      const config = variantInfo.multiplicationConfig;
      return `×${config.tableOfMultiplication[0]}`;
    }
    default:
      throw new UnexpectedValueError(variantInfo);
  }
}

export function getClickInOrderGameVariant(
  variant: string,
): ClickInOrderGameExtendedVariantInfo {
  const variantInfo =
    clickInOrderGameVariants[variant] || clickInOrderGameVariants.aa;
  return {
    ...variantInfo,
    mainCode: determineMainCode(variantInfo),
    description: createDescription(variantInfo),
    iconText: createIconText(variantInfo),
  };
}
