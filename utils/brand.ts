// utils/brand.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { useAssets } from 'expo-asset';
import { useFonts } from 'expo-font';

// Exportamos los assets (asegúrate de haber subido estos archivos en Snack)
export const brandLogo = require("../assets/images/adaptive-icon.png");
export const brandLogoLight = require("../assets/images/adaptive-icon.png");

// Hook personalizado
export const useBrandAssets = () => {
  const [fontsLoaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const [assetsLoaded] = useAssets([
    brandLogo,
    brandLogoLight,
    // Si tienes googleIcon, súbelo también y descomenta esta línea:
    // require("../assets/images/googleIcon.png"),
  ]);

  return { fontsLoaded, assetsLoaded };
};
