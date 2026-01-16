// screens/organization/OrgNewCommunicationScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedButton from '../../components/ThemedButton';
import ThemedPicker from '../../components/ThemedPicker';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/Styles';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function OrgNewCommunicationScreen({ navigation }) {
  const screenType = 'newCommunication';
  const entityType = 'organization';
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const [columnCount, setColumnCount] = useState(1);
  const [sector, setSector] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    const updateColumns = () => {
      const width = Dimensions.get('window').width;
      setColumnCount(width > 800 ? 3 : width > 500 ? 2 : 1);
    };
    updateColumns();
    const subscription = Dimensions.addEventListener('change', updateColumns);
    return () => subscription?.remove();
  }, []);

  const handleNext = () => {
    navigation.navigate('OrgDrafts');
  };

  const isFormValid = sector && category && message && recipient;

  const fields = [
    {
      title: t(`${entityType}.${screenType}.pickerSector`),
      value: sector,
      setValue: setSector,
      type: 'picker',
      options: [
        { label: '--', value: '' },
        { label: t('care'), value: 'care' },
        { label: t('emergency'), value: 'emergency' },
      ],
    },
    {
      title: t(`${entityType}.${screenType}.pickerCategory`),
      value: category,
      setValue: setCategory,
      type: 'picker',
      options: [
        { label: '--', value: '' },
        { label: t('notification'), value: 'notification' },
        { label: t('reminder'), value: 'reminder' },
        { label: t('instruction'), value: 'instruction' },
        { label: t('alert'), value: 'alert' },
      ],
    },
    {
      title: t(`${entityType}.${screenType}.inputRecipient`),
      placeholder: t(`${entityType}.${screenType}.placeholderRecipient`),
      value: recipient,
      setValue: setRecipient,
    },
    {
      title: t(`${entityType}.${screenType}.inputMessage`),
      placeholder: t(`${entityType}.${screenType}.placeholderMessage`),
      value: message,
      setValue: setMessage,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title={t(`${entityType}.screens.${screenType}.title`)}
          subtitle={t(`${entityType}.screens.${screenType}.subtitle`)}
          description={t(`${entityType}.screens.${screenType}.description`)}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {fields.map((field, idx) => (
            <View
              key={idx}
              style={{
                width: `${100 / columnCount}%`,
                padding: 8,
              }}
            >
              <ThemedText style={{ color: textColor }}>{field.title}</ThemedText>
              {field.type === 'picker' ? (
                <ThemedPicker
                  selectedValue={field.value}
                  onValueChange={field.setValue}
                  items={field.options}
                  accessibilityLabel={field.title}
                />
              ) : (
                <ThemedInput
                  placeholder={field.placeholder}
                  value={field.value}
                  onChangeText={field.setValue}
                  accessibilityLabel={field.title}
                />
              )}
            </View>
          ))}
        </View>

        <ThemedButton
          title={t('next')}
          onPress={handleNext}
          disabled={!isFormValid}
        />
      </ScrollView>
    </View>
  );
}
