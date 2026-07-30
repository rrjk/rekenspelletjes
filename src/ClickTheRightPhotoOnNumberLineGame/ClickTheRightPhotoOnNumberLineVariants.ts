import { Color } from '../Colors';

interface ClickTheRightPhotoOnNumberLineVariantInfo {
  iconColor: Color;
  minimum: number;
  maximum: number;
  show10TickMarks: boolean;
  show5TickMarks: boolean;
  show1TickMarks: boolean;
  showAll10Numbers: boolean;
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
  minimum: 0,
  maximum: 20,
  show10TickMarks: true,
  show5TickMarks: true,
  show1TickMarks: true,
  showAll10Numbers: true,
};

export const clickTheRightPhotoOnNumberLineVariants: Record<
  string,
  ClickTheRightPhotoOnNumberLineVariantInfo
> = {
  aa: defaultVariant,
  ab: {
    iconColor: 'brown',
    minimum: 0,
    maximum: 20,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  ac: {
    iconColor: 'olive',
    minimum: 0,
    maximum: 20,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  ad: {
    iconColor: 'teal',
    minimum: 0,
    maximum: 20,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  },
  ba: {
    iconColor: 'lavender',
    minimum: 0,
    maximum: 30,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
  bb: {
    iconColor: 'beige',
    minimum: 0,
    maximum: 30,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  bc: {
    iconColor: 'apricot',
    minimum: 0,
    maximum: 30,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  bd: {
    iconColor: 'yellow',
    minimum: 0,
    maximum: 30,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  },
  ca: {
    iconColor: 'orange',
    minimum: 0,
    maximum: 50,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
  cb: {
    iconColor: 'red',
    minimum: 0,
    maximum: 50,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  cc: {
    iconColor: 'magenta',
    minimum: 0,
    maximum: 50,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  cd: {
    iconColor: 'pink',
    minimum: 0,
    maximum: 50,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  },
  da: {
    iconColor: 'green',
    minimum: 0,
    maximum: 100,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
  db: {
    iconColor: 'lime',
    minimum: 0,
    maximum: 100,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  dc: {
    iconColor: 'mint',
    minimum: 0,
    maximum: 100,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  dd: {
    iconColor: 'cyan',
    minimum: 0,
    maximum: 100,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: false,
  },
  ea: {
    iconColor: 'navy',
    minimum: 0,
    maximum: 10,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: true,
    showAll10Numbers: true,
  },
  eb: {
    iconColor: 'blue',
    minimum: 0,
    maximum: 10,
    show10TickMarks: true,
    show5TickMarks: true,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
  ec: {
    iconColor: 'purple',
    minimum: 0,
    maximum: 10,
    show10TickMarks: true,
    show5TickMarks: false,
    show1TickMarks: false,
    showAll10Numbers: true,
  },
};

function determineMainCode(): string {
  return 'T';
}

function createDescription(
  info: ClickTheRightPhotoOnNumberLineVariantInfo,
): string {
  const rangeText = `van ${info.minimum} tot en met ${info.maximum}`;
  if (info.show1TickMarks) {
    return `Klik de juiste foto op de getallenlijn ${rangeText} met alle tientallen, vijf- en eenstreepjes.`;
  }
  if (info.show5TickMarks) {
    return `Klik de juiste foto op de getallenlijn ${rangeText} met alle tientallen en vijfstreepjes.`;
  }
  if (info.showAll10Numbers) {
    return `Klik de juiste foto op de getallenlijn ${rangeText} met alle tientallen.`;
  }
  return `Klik de juiste foto op de getallenlijn ${rangeText} met alleen streepjes op de tientallen.`;
}

function getPhotoId(info: ClickTheRightPhotoOnNumberLineVariantInfo): string {
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

function getMid(info: ClickTheRightPhotoOnNumberLineVariantInfo): number {
  return info.maximum - 10;
}

export function getClickTheRightPhotoOnNumberLineVariant(
  variant: string,
): ClickTheRightPhotoOnNumberLineExtendedVariantInfo {
  const variantInfo =
    clickTheRightPhotoOnNumberLineVariants[variant] || defaultVariant;
  const mainCode = determineMainCode();
  const description = createDescription(variantInfo);
  const photoId = getPhotoId(variantInfo);
  const mid = getMid(variantInfo);
  return { ...variantInfo, mainCode, description, photoId, mid };
}
