// utils/globalStyle.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { StyleSheet } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import Colors from "../constants/Colors";

const colorPalette = {
  primaryHover: Colors.light.tint,
  header: Colors.light.card,
};

const themeColor = {
  lightBackground: Colors.light.background,
  darkBackground: Colors.dark.background,
  lightText: Colors.light.text,
  darkText: Colors.dark.text,
};

// En lugar de enum
export const WebComponentStatus = {
  NONE: "none",
  HOVER: "hover",
  PRESSED: "pressed",
};

export const colorStyles = StyleSheet.create({
  mainBackgroundHover: {
    backgroundColor: colorPalette.primaryHover,
  },
  mainBackgroundPressed: {
    backgroundColor: colorPalette.header,
  },
});

export function globalStyle({ colorTheme, interfaceSize }) {
  return StyleSheet.create({
    backgroundColor: {
      height: "100%",
      backgroundColor:
        colorTheme === "light"
          ? themeColor.lightBackground
          : themeColor.darkBackground,
    },
    textColor: {
      color:
        colorTheme === "light"
          ? themeColor.darkText
          : themeColor.lightText,
    },
    container: {
      height: "100%",
      width: "100%",
      justifyContent: "space-evenly",
      backgroundColor:
        colorTheme === "light"
          ? themeColor.lightBackground
          : themeColor.darkBackground,
    },
    titleText: {
      width: "100%",
      color:
        colorTheme === "light"
          ? themeColor.darkText
          : themeColor.lightText,
      textAlign: "center",
      fontWeight: "700",
      fontSize: moderateScale(
        interfaceSize === "S"
          ? 32
          : interfaceSize === "M"
          ? 45
          : interfaceSize === "L"
          ? 50
          : 45,
        0.5
      ),
      alignSelf: "center",
      paddingHorizontal: scale(20),
    },
    shortDescriptionText: {
      width: "100%",
      color:
        colorTheme === "light"
          ? themeColor.darkText
          : themeColor.lightText,
      textAlign: "center",
      fontFamily: "Poppins",
      fontSize: moderateScale(
        interfaceSize === "S"
          ? 16
          : interfaceSize === "M"
          ? 20
          : interfaceSize === "L"
          ? 28
          : 16,
        0.5
      ),
      alignSelf: "center",
      paddingHorizontal: scale(20),
    },
  });
}
