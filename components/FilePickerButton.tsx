// components/FilePickerButton.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import ThemedButton from './ThemedButton';
import ThemedText from './ThemedText';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';

type FilePickerButtonProps = {
  onFilePick: (files: DocumentPicker.DocumentPickerAsset[]) => void;
  allowedMimeTypes?: string | string[];
  title: string;
  disabled?: boolean;
  maxFiles?: number;
  [key: string]: any;
};

const FilePickerButton = ({
  onFilePick,
  allowedMimeTypes,
  title,
  disabled = false,
  maxFiles = 1,
  ...props
}: FilePickerButtonProps) => {
  const [pickedFiles, setPickedFiles] = useState([]);
  const { scaleFactor } = useAccessibilityContext();
  const componentStyles = getComponentStyles(scaleFactor, useThemeColor);
  
  // This effect notifies the parent component whenever the internal file list changes.
  useEffect(() => {
    // For single-file pickers, return the single asset object or null.
    const filesToReturn = maxFiles === 1 ? (pickedFiles[0] ? [pickedFiles[0]] : []) : pickedFiles;
    onFilePick(filesToReturn);
  }, [pickedFiles]);

  const handlePress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedMimeTypes,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPickedFiles(prevFiles => [...prevFiles, ...result.assets]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleRemove = (fileToRemove) => {
    setPickedFiles(prevFiles => prevFiles.filter(file => file.uri !== fileToRemove.uri));
  };

  const isButtonDisabled = disabled || (!!maxFiles && pickedFiles.length >= maxFiles);
  const currentTitle = pickedFiles.length > 0 ? `${pickedFiles.length} file(s) attached` : title;

  return (
    <View style={{ marginBottom: 12, width: '100%' }}>
      {/* List of picked files */}
      {pickedFiles.map((file, index) => (
        <View key={index} style={componentStyles.fileItemContainer}>
          <ThemedText style={componentStyles.fileName} numberOfLines={1}>
            {file.name}
          </ThemedText>
          <Pressable onPress={() => handleRemove(file)} style={componentStyles.removeButton} accessibilityRole="button" accessibilityLabel={`Remove ${file.name}`}>
            <View style={componentStyles.removeIconContainer}>
              <Ionicons name="close" size={24 * scaleFactor} color="white" />
            </View>
          </Pressable>
        </View>
      ))}

      {/* The main button to add files, only shown if we haven't reached the max */}
      {!isButtonDisabled && (
        <ThemedButton
          title={title}
          onPress={handlePress}
          type="outline"
          disabled={disabled}
          {...props}
        />
      )}
    </View>
  );
};

const getComponentStyles = (scaleFactor, useThemeColor) => {
  const text = useThemeColor({}, 'text');
  const input = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return StyleSheet.create({
    fileItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: input,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: border,
    },
    fileName: {
      flex: 1,
      fontSize: 16 * scaleFactor,
      marginRight: 12,
    },
    removeButton: {
      padding: 2,
    },
    removeIconContainer: {
      backgroundColor: 'red',
      borderRadius: 16 * scaleFactor,
      width: 32 * scaleFactor,
      height: 32 * scaleFactor,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default FilePickerButton;
