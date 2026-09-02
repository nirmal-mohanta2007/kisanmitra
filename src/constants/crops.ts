import { CropType } from '../types/enums';
import { CropInfo } from '../types/models';

export const MSP_CROPS = [
  { id: 'c1', name: 'Paddy', nameHi: 'धान', pricePerQtl: 2320, icon: 'barley' },
  { id: 'c2', name: 'Wheat', nameHi: 'गेहूं', pricePerQtl: 2275, icon: 'grain' },
  { id: 'c3', name: 'Maize', nameHi: 'मक्का', pricePerQtl: 2090, icon: 'corn' },
  { id: 'c4', name: 'Soybean', nameHi: 'सोयाबीन', pricePerQtl: 4892, icon: 'sprout' },
  { id: 'c5', name: 'Jowar', nameHi: 'ज्वार', pricePerQtl: 3371, icon: 'grass' },
];

export const CROP_DATA: Record<CropType, CropInfo> = {
  [CropType.PADDY]: {
    type: CropType.PADDY,
    displayName: 'Paddy (Rice)',
    displayNameHi: 'धान (चावल)',
    mspPerQuintal: 2320,
    unit: 'quintal',
  },
  [CropType.WHEAT]: {
    type: CropType.WHEAT,
    displayName: 'Wheat',
    displayNameHi: 'गेहूँ',
    mspPerQuintal: 2275,
    unit: 'quintal',
  },
  [CropType.MAIZE]: {
    type: CropType.MAIZE,
    displayName: 'Maize',
    displayNameHi: 'मक्का',
    mspPerQuintal: 2090,
    unit: 'quintal',
  },
  [CropType.SOYBEAN]: {
    type: CropType.SOYBEAN,
    displayName: 'Soybean',
    displayNameHi: 'सोयाबीन',
    mspPerQuintal: 4892,
    unit: 'quintal',
  },
  [CropType.JOWAR]: {
    type: CropType.JOWAR,
    displayName: 'Jowar (Sorghum)',
    displayNameHi: 'ज्वार',
    mspPerQuintal: 3371,
    unit: 'quintal',
  },
};
