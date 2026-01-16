import * as DocumentPicker from 'expo-document-picker';// screens/communications/ChatScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { mockChatMessages } from '../../demo/connections.data';
import { useThemeColor } from '../../hooks/useThemeColor';


// Mock data for messages
// This is now imported from demo/connections.data.js


// A separate component for the input toolbar that can safely use hooks
const CustomInputToolbar = (props) => {
  const composerBackgroundColor = useThemeColor({light: '#f0f0f0', dark: '#1e1e1e'});
  const separatorColor = useThemeColor({}, 'separator');
  const textColor = useThemeColor({}, 'text');

  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: composerBackgroundColor,
        borderTopColor: separatorColor,
      }}
      textInputStyle={{ color: textColor }}
    />
  );
};

export default function ChatScreen() {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { connectionId, connectionName } = route.params ?? {};
  const [messages, setMessages] = useState([]);
  
  const backgroundColor = useThemeColor({}, 'background');
  const userBubbleColor = useThemeColor({}, 'buttonPrimaryBackground');
  const userBubbleTextColor = useThemeColor({}, 'buttonPrimaryText');
  const otherBubbleColor = useThemeColor({ light: '#ffffff', dark: '#333333' });
  const textColor = useThemeColor({}, 'text');


  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/fhir+json'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        Alert.alert(
          'Document Selected',
          `Name: ${result.assets[0].name}\nSize: ${result.assets[0].size} bytes\nURI: ${result.assets[0].uri}`
        );
        // Aquí es donde, en el futuro, se adjuntaría el archivo al mensaje de chat.
      } else {
        Alert.alert('No document selected.');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Could not pick a document.');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: connectionName ?? t('family.screens.communications.chatTitle', 'Chat'),
      headerShown: true, // Ensure the header is visible
      headerStyle: { backgroundColor: backgroundColor },
      headerTintColor: textColor,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            onPress={handlePickDocument}
            style={{ marginRight: 20 }}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Attach file"
            accessibilityHint="Opens the document picker to attach a file to the chat"
          >
            <Ionicons name="attach" size={24} color={textColor} />
          </Pressable>
          <Pressable
            onPress={() => Alert.alert(
              'Chat Options',
              'Aquí se podrán gestionar permisos, etc.'
            )}
            style={{ marginRight: 15 }}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Chat options"
            accessibilityHint="Opens a menu with chat options like permissions"
          >
            <Ionicons name="ellipsis-vertical" size={24} color={textColor} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, connectionName, backgroundColor, textColor]);
  
  useEffect(() => {
    const messageData = mockChatMessages[connectionId] || [];
    const translatedMessages = messageData.map(msg => ({
      ...msg,
      text: t(`family.screens.communications.chatMessages.${msg.translationKey.replace(/\./g, '-')}`),
      user: {
        ...msg.user,
        name: t(`family.screens.communications.chatMessages.users.${msg.user.nameKey}`),
      }
    }));
    setMessages(translatedMessages);
  }, [connectionId, t]);

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: userBubbleColor,
          },
          left: {
            backgroundColor: otherBubbleColor,
          },
        }}
        textStyle={{
          right: {
            color: userBubbleTextColor,
          },
          left: {
            color: textColor,
          },
        }}
      />
    );
  };
  
  const renderInputToolbar = (props) => {
    // Now just returns the new component
    return <CustomInputToolbar {...props} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1, // Represents the current user
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
      />
    </View>
  );
}
