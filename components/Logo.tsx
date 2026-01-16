// components/Logo.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { Image, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

export default function Logo({ size = 80 }) {
  return (
    <Image
      source={require('../assets/images/react-logo.png')}
      style={[styles.image, { width: scale(size), height: scale(size) }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    marginBottom: scale(20),
  },
});
