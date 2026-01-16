// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons from the expo library

const CollapsibleView = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [animation] = useState(new Animated.Value(0));

  const toggleCollapse = () => {
    if (collapsed) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, // Height cannot be animated with native driver
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setCollapsed(!collapsed);
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Adjust this based on content size
  });

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableWithoutFeedback onPress={toggleCollapse}>
        <View style={styles.header}>
          <Ionicons 
            name={collapsed ? 'chevron-forward-outline' : 'chevron-down-outline'} 
            size={24} 
            color="black" 
            style={styles.icon} 
          />
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
      {!collapsed && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );

};

const styles = StyleSheet.create({
  collapsibleContainer: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    paddingVertical: 8,
  },
});

export default CollapsibleView;
