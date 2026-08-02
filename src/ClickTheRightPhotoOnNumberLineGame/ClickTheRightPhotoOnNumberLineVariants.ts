import type { Color } from '../Colors';
import {
  DescribeNumberLineParameters,
  type NumberLineParameters,
} from '../NumberLineParameters';

interface ClickTheRightPhotoOnNumberLineVariantInfo {
  iconColor: Color;
  numberLineParameters: NumberLineParameters;
}

export interface ClickTheRightPhotoOnNumberLineExtendedVariantInfo
  extends ClickTheRightPhotoOnNumberLineVariantInfo {
  mainCode: string;
  description: string;
  photoId: string;
  mid: number;
}

const defaultVariant: ClickTheRightPhotoOnNumberLineVariantInfo = {
  iconColor: 'maroon',
  numberLineParameters: {
    minimum: 0,
    maximum: 20,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
};

export const clickTheRightPhotoOnNumberLineVariants: Record<
  string,
  ClickTheRightPhotoOnNumberLineVariantInfo
> = {
  aa: defaultVariant,
  ab: {
    iconColor: 'brown',
    numberLineParameters: {
      minimum: 0,
      maximum: 20,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  ac: {
    iconColor: 'olive',
    numberLineParameters: {
      minimum: 0,
      maximum: 20,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  ad: {
    iconColor: 'teal',
    numberLineParameters: {
      minimum: 0,
      maximum: 20,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: false,
    },
  },
  ba: {
    iconColor: 'lavender',
    numberLineParameters: {
      minimum: 0,
      maximum: 30,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: true,
      showAll10Numbers: true,
    },
  },
  bb: {
    iconColor: 'beige',
    numberLineParameters: {
      minimum: 0,
      maximum: 30,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  bc: {
    iconColor: 'apricot',
    numberLineParameters: {
      minimum: 0,
      maximum: 30,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  bd: {
    iconColor: 'yellow',
    numberLineParameters: {
      minimum: 0,
      maximum: 30,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: false,
    },
  },
  ca: {
    iconColor: 'orange',
    numberLineParameters: {
      minimum: 0,
      maximum: 50,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: true,
      showAll10Numbers: true,
    },
  },
  cb: {
    iconColor: 'red',
    numberLineParameters: {
      minimum: 0,
      maximum: 50,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  cc: {
    iconColor: 'magenta',
    numberLineParameters: {
      minimum: 0,
      maximum: 50,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  cd: {
    iconColor: 'pink',
    numberLineParameters: {
      minimum: 0,
      maximum: 50,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: false,
    },
  },
  da: {
    iconColor: 'green',
    numberLineParameters: {
      minimum: 0,
      maximum: 100,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: true,
      showAll10Numbers: true,
    },
  },
  db: {
    iconColor: 'lime',
    numberLineParameters: {
      minimum: 0,
      maximum: 100,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  dc: {
    iconColor: 'mint',
    numberLineParameters: {
      minimum: 0,
      maximum: 100,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  dd: {
    iconColor: 'cyan',
    numberLineParameters: {
      minimum: 0,
      maximum: 100,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: false,
    },
  },
  ea: {
    iconColor: 'navy',
    numberLineParameters: {
      minimum: 0,
      maximum: 10,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: true,
      showAll10Numbers: true,
    },
  },
  eb: {
    iconColor: 'blue',
    numberLineParameters: {
      minimum: 0,
      maximum: 10,
      show10TickMarks: true,
      show5TickMarks: true,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
  ec: {
    iconColor: 'purple',
    numberLineParameters: {
      minimum: 0,
      maximum: 10,
      show10TickMarks: true,
      show5TickMarks: false,
      show1TickMarks: false,
      showAll10Numbers: true,
    },
  },
};

function determineMainCode(): string {
  return 'T';
}

function createDescription(info: NumberLineParameters): string {
  return `Kies de juiste foto op de getallenlijn ${DescribeNumberLineParameters(info, 'present')}`;
}

function getPhotoId(info: NumberLineParameters): string {
  if (info.minimum === 0 && info.maximum === 10) {
    return 'Manfred';
  }
  if (info.minimum === 0 && info.maximum === 20) {
    return 'Anne';
  } else if (info.minimum === 0 && info.maximum === 30) {
    return 'Johannes';
  } else if (info.minimum === 0 && info.maximum === 50) {
    return 'Jan';
  } else if (info.minimum === 0 && info.maximum === 100) {
    return 'Frank';
  }
  return 'Disabled';
}

function getMid(info: NumberLineParameters): number {
  return info.maximum - 10;
}

export function getClickTheRightPhotoOnNumberLineVariant(
  variant: string,
): ClickTheRightPhotoOnNumberLineExtendedVariantInfo {
  const variantInfo =
    clickTheRightPhotoOnNumberLineVariants[variant] || defaultVariant;
  const mainCode = determineMainCode();
  const numberLineParameters = variantInfo.numberLineParameters;
  const description = createDescription(numberLineParameters);
  const photoId = getPhotoId(numberLineParameters);
  const mid = getMid(numberLineParameters);
  return { ...variantInfo, mainCode, description, photoId, mid };
}
