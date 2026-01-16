// screens/organization/OrgAddEvidenceScreen.js
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';

import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedPicker from '../../components/ThemedPicker';
import ThemedButton from '../../components/ThemedButton';

const OrgAddEvidenceScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { registrationData } = route.params || {};

  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  // State for this screen's form
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idImage, setIdImage] = useState(null);

  const handleRegister = () => {
    // Combine data from previous screen and this screen
    const finalData = {
      ...registrationData,
      evidence: {
        idType,
        idNumber,
        idImageUri: idImage?.uri,
      }
    };

    console.log("FINAL DATA TO CREATE JOB:", JSON.stringify(finalData, null, 2));
    // TODO: Build the full job payload and call createJob here
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <ScreenHeader 
        title="Add Evidence" // TODO: Add translations
        subtitle="Step 2: Provide identity document"
      />
      
      <View style={styles.container}>
        <ThemedText style={styles.formLabel}>Identity Document Type</ThemedText>
        {/* Placeholder for ID Type Picker */}
        <ThemedInput
          placeholder="e.g., Passport, Driver's License"
          value={idType}
          onChangeText={setIdType}
        />

        <ThemedText style={styles.formLabel}>Document Number</ThemedText>
        <ThemedInput
          placeholder="Enter document number"
          value={idNumber}
          onChangeText={setIdNumber}
        />

        <ThemedText style={styles.formLabel}>Document Image</ThemedText>
        {/* Placeholder for Image Picker */}
        <ThemedButton 
          title={idImage ? `✓ ${idImage.name}` : "Attach Image"}
          onPress={() => setIdImage({ name: 'id_front.jpg' })} // Mock action
          type="outline"
        />

        <ThemedButton
          title="Register"
          onPress={handleRegister}
          style={{ marginTop: 20 }}
        />
      </View>
    </ScrollView>
  );
};

export default OrgAddEvidenceScreen;
