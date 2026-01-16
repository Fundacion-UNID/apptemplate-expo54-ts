// utils/scale.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { PixelRatio } from 'react-native';

// Determine interface size based on font scale
export const getInterfaceSize = () => {
  const fontScale = PixelRatio.getFontScale();

  if (fontScale < 1.2) return 'S';
  if (fontScale < 2.8) return 'M';
  return 'L';
};
