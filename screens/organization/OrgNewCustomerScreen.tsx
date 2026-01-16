// screens/organization/OrgNewCustomerScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Pressable, Platform, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';

import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { getScreenStyles } from '../../constants/Styles';
import ScreenHeader from '../../components/ScreenHeader';
import ThemedText from '../../components/ThemedText';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedPicker from '../../components/ThemedPicker';
import ThemedButton from '../../components/ThemedButton';
import FilePickerButton from '../../components/FilePickerButton';
import { Routes } from '../../constants/Routes';
import { useJobs } from '../../context/JobContext';
import { useProfile } from '../../context/ProfileContext';
import { useDirectory } from '../../context/DirectoryContext';
import { ClaimsPersonSchemaorg, ClaimsServiceSchemaorg, FormRequestType } from '../../constants/Schemas';
import { encodeHexToMultibase58btc } from 'gdc-common-utils-ts/utils/multibase58';
import { ServiceIds } from '../../constants/ServiceIds';

const readFileAsBase64ForWeb = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Unexpected file reader result type'));
        return;
      }
      const base64Content = result.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const OrgNewCustomerScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  // const route = useRoute();
  const { scaleFactor } = useAccessibilityContext();
  const primaryColor = useThemeColor({}, 'primary');
  const styles = getScreenStyles(scaleFactor, primaryColor);
  const backgroundColor = useThemeColor({}, 'background');
  const white = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'text');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const inputBackgroundColor = useThemeColor({}, 'input');

  const [activeTab, setActiveTab] = useState('digital');
  const [provider, setProvider] = useState('UNID');
  const [termsPdf, setTermsPdf] = useState(null);
  const [alternateName, setAlternateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submittedDid, setSubmittedDid] = useState(null);
  const [submittedThid, setSubmittedThid] = useState(null);
  const [columnCount, setColumnCount] = useState(1);
  const [evidenceData, setEvidenceData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.evidenceData) {
        setEvidenceData(route.params.evidenceData);
      }
    }, [route.params?.evidenceData])
  );

  useEffect(() => {
    const updateColumns = () => {
      const width = Dimensions.get('window').width;
      setColumnCount(width > 800 ? 3 : width > 500 ? 2 : 1);
    };
    updateColumns();
    const subscription = Dimensions.addEventListener('change', updateColumns);
    return () => subscription?.remove();
  }, []);

  const { createJob, sync, allJobs } = useJobs();
  const { addRecentResource } = useDirectory();
  const { profile } = useProfile();

  const currentJob = useMemo(() => {
    if (!submittedThid) return null;
    // CORRECT: Find job by the top-level 'thid' property
    return allJobs.find(job => job.thid === submittedThid);
  }, [allJobs, submittedThid]);
  
  const providerItems = [
    { label: 'API-demo', value: 'api-demo.example.com' }
  ];

  const isFormValid = useMemo(() => {
    if (submittedThid) return false;
    
    const baseConditionsMet = !!termsPdf && (email.trim() !== '' || phone.trim() !== '');
    if (!baseConditionsMet) return false;

    if (activeTab === 'in-person') {
      return !!evidenceData; // Only enabled if evidence is provided
    }
    
    // For 'digital' tab, base conditions are enough
    return true; 
  }, [termsPdf, email, phone, activeTab, submittedThid, evidenceData]);

  const handlePrimaryAction = async () => {
    if (!isFormValid || !profile) return;
    
    if (activeTab === 'in-person') {
      const registrationData = { provider, termsPdf, email, phone };
      navigation.navigate(Routes.Organization.AddEvidence.name, { registrationData });
      return;
    }

    // We wrap the entire async operation in a try/catch block to handle all possible errors
    // (e.g., file reading, job creation, network sync) in one place.
    try {
      const thid = uuidv4();
      // 1. Update the UI immediately to show the status view.
      setSubmittedThid(thid);

      let pdfBase64Content = null;
      if (termsPdf) {
        if (Platform.OS === 'web') {
          pdfBase64Content = await readFileAsBase64ForWeb(termsPdf.file);
        } else {
          pdfBase64Content = await readAsStringAsync(termsPdf.uri, { encoding: EncodingType.Base64 });
        }
      }
      
      const rawUuid = uuidv4();
      const multibaseUuid = encodeHexToMultibase58btc(rawUuid);
      const individualDid = `did:web:${provider.toLowerCase()}.example.com:individual:multibase:${multibaseUuid}`;
      setSubmittedDid(individualDid);

      const claims = {
        [ClaimsPersonSchemaorg.identifier]: individualDid,
        [ClaimsServiceSchemaorg.termsOfService]: "https://provider.example.com/terms",
        ...(email && { [ClaimsPersonSchemaorg.email]: email }),
        ...(phone && { [ClaimsPersonSchemaorg.telephone]: phone }),
        ...(alternateName && { [ClaimsPersonSchemaorg.alternateName]: alternateName }),
      };
      
      const evidence = { type: "application/pdf", attachments: [{ content: pdfBase64Content, content_type: "application/pdf" }] };
      const entry1 = { meta: { claims, verification: { evidence: [evidence] } }, request: { method: 'POST', url: 'individual/org.schema/Person/' }, type: FormRequestType.IndividualTerms };
      const entry2 = { meta: { claims: { [ClaimsPersonSchemaorg.identifier]: individualDid } }, request: { method: 'POST', url: 'individual/org.schema/Person/' }, type: FormRequestType.PersonalIdentity };

      const attributesToIndex = [
        { name: ClaimsPersonSchemaorg.identifier, value: individualDid, type: 'did' },
        ...(email ? [{ name: ClaimsPersonSchemaorg.email, value: email }] : []),
        ...(phone ? [{ name: ClaimsPersonSchemaorg.telephone, value: phone }] : []),
      ];

      // --- PREPARE THE CUSTOMER DOCUMENT ---
      // This is the unprotected, plaintext version of the contact that will be cached.
      const unprotectedCustomerDoc = {
        id: individualDid,
        type: 'Contact.Customer',
        content: {
          [ClaimsPersonSchemaorg.identifier]: `urn:uuid:${rawUuid}`,
          [ClaimsPersonSchemaorg.givenName]: 'Joseph', // Placeholder
          [ClaimsPersonSchemaorg.familyName]: 'Doe',    // Placeholder
          [ClaimsPersonSchemaorg.alternateName]: alternateName,
          [ClaimsPersonSchemaorg.email]: email,
          [ClaimsPersonSchemaorg.telephone]: phone,
        },
        indexed: attributesToIndex,
      };
      
      // 2. Add the new customer to the "recents" cache for immediate use.
      addRecentResource(unprotectedCustomerDoc);

      // 3. Create the registration job locally.
      const newJob = await createJob({
        thid,
        type: 'Registration', // A clear type for the job itself
        body: { data: [entry1, entry2] },
        serviceId: ServiceIds.HEALTHCARE_CUSTOMERID_BATCH,
        to: [profile.did], // This job is internal to the organization
      });

      // 4. If local creation is successful, trigger the background sync.
      if (newJob) {
        console.log(`Job ${thid} created locally. Starting sync.`);
        sync(); // sync() is a "fire and forget" background task.
      }

    } catch (err) {
      // --- ROBUST ERROR HANDLING ---
      // If any part of the process fails, we catch the error here.
      console.error("A critical error occurred during the registration process:", err);

      // Display a user-friendly modal. This prevents leaking technical details
      // to the console and provides a better user experience.
      Alert.alert(
        t('organization.screens.registerUnifiedIndex.errorModal.title'),
        t('organization.screens.registerUnifiedIndex.errorModal.message'),
        [{ text: t('organization.screens.registerUnifiedIndex.errorModal.button') }]
      );

      // Revert the UI to its original state.
      setSubmittedThid(null);
    }
  };

  const renderPostSubmissionView = () => {
    return (
      <View style={{ alignItems: 'center', padding: 20, justifyContent: 'center', flex: 1 }}>
        <ThemedText variant="title" style={{ marginBottom: 16 }}>
          {t('organization.screens.registerCustomer.submissionSentTitle')}
        </ThemedText>
        
        <ThemedText style={{ textAlign: 'center' }}>
          {t('organization.screens.registerCustomer.jobIdLabel')}
        </ThemedText>
        <ThemedText selectable style={{ fontFamily: 'monospace', marginVertical: 8 }}>
          {submittedThid}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.8 }}>
          {t('organization.screens.registerCustomer.submissionTracking')}
        </ThemedText>
        
        <View style={{ width: '100%', marginTop: 32 }}>
          <ThemedButton 
            title={t('organization.screens.registerCustomer.createConnectionButton')}
            onPress={() => navigation.navigate(Routes.Organization.AddConnection.name, { preselectedDid: submittedDid })}
            style={{ marginBottom: 16 }}
            accessible
            accessibilityLabel={t('organization.screens.registerCustomer.createConnectionButton')}
            accessibilityRole="button"
          />
          <ThemedText style={{ textAlign: 'center', marginVertical: 8 }}>
            {t('organization.screens.registerCustomer.orSeparator')}
          </ThemedText>
          <ThemedButton 
            title={t('organization.screens.registerCustomer.finishButton')}
            onPress={() => navigation.goBack()}
            type="secondary"
            accessible
            accessibilityLabel={t('organization.screens.registerCustomer.finishButton')}
            accessibilityRole="button"
          />
        </View>
      </View>
    );
  };

  const renderFormView = () => (
    <View>
      <View style={styles.tabGroupContainer}>
        <View style={styles.tabGroup}>
          <Pressable onPress={() => setActiveTab('digital')} style={[styles.inactiveTab, activeTab === 'digital' && [styles.activeTab, { backgroundColor: primaryColor }]]} accessible accessibilityRole="button" accessibilityLabel={t('organization.screens.registerCustomer.tabs.digital')}>
            <ThemedText style={activeTab === 'digital' ? [styles.activeTabText, { color: white }] : [styles.inactiveTabText, { color: textColor }]}>{t('organization.screens.registerCustomer.tabs.digital')}</ThemedText>
          </Pressable>
          <Pressable onPress={() => setActiveTab('in-person')} style={[styles.inactiveTab, activeTab === 'in-person' && [styles.activeTab, { backgroundColor: primaryColor }]]} accessible accessibilityRole="button" accessibilityLabel={t('organization.screens.registerCustomer.tabs.inPerson')}>
            <ThemedText style={activeTab === 'in-person' ? [styles.activeTabText, { color: white }] : [styles.inactiveTabText, { color: textColor }]}>{t('organization.screens.registerCustomer.tabs.inPerson')}</ThemedText>
          </Pressable>
        </View>
      </View>
      <ThemedText style={styles.formLabel}>{t('organization.screens.registerCustomer.termsLabel')}</ThemedText>
      <FilePickerButton
        title={t('organization.screens.registerCustomer.attachButton')}
        onFilePick={setTermsPdf}
        allowedMimeTypes={['application/pdf']}
      />
      <ThemedText style={styles.formLabel}>{t('organization.screens.registerCustomer.providerLabel')}</ThemedText>
      <ThemedPicker selectedValue={provider} onValueChange={setProvider} items={providerItems} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
        <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
          <ThemedText style={styles.formLabel}>{t('organization.screens.registerCustomer.emailLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.registerCustomer.emailPlaceholder')} value={email} onChangeText={setEmail} keyboardType="email-address" accessible accessibilityLabel={t('organization.screens.registerCustomer.emailPlaceholder')} />
        </View>
        <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
          <ThemedText style={styles.formLabel}>{t('organization.screens.registerCustomer.phoneLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.registerCustomer.phonePlaceholder')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" accessible accessibilityLabel={t('organization.screens.registerCustomer.phonePlaceholder')} />
        </View>
        <View style={{ width: `${100 / columnCount}%`, padding: 8 }}>
          <ThemedText style={styles.formLabel}>{t('organization.screens.registerCustomer.alternateNameLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.registerCustomer.alternateNamePlaceholder')} value={alternateName} onChangeText={setAlternateName} accessible accessibilityLabel={t('organization.screens.registerCustomer.alternateNamePlaceholder')} />
        </View>
      </View>
      {activeTab === 'digital' ? (
        <ThemedButton
          title={t('organization.screens.registerCustomer.registerButton')}
          onPress={handlePrimaryAction}
          style={{ marginTop: 20 }}
          disabled={!isFormValid}
          accessibilityLabel={t('organization.screens.registerCustomer.registerButton')}
        />
      ) : (
        <>
          <ThemedButton
            title={t('organization.screens.registerCustomer.addEvidenceButton')}
            onPress={() => {
              const registrationData = { provider, termsPdf, email, phone, alternateName };
              navigation.navigate(Routes.Organization.AddEvidence.name, { registrationData });
            }}
            style={{ marginTop: 20 }}
            accessibilityLabel={t('organization.screens.registerCustomer.addEvidenceButton')}
          />
          <ThemedButton
            title={t('organization.screens.registerCustomer.continueButton')}
            onPress={handlePrimaryAction}
            style={{ marginTop: 10 }}
            disabled={!isFormValid}
            accessibilityLabel={t('organization.screens.registerCustomer.continueButton')}
          />
        </>
      )}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <ScreenHeader title={t('organization.screens.registerCustomer.title')} subtitle={t('organization.screens.registerCustomer.subtitle')} />
      <View style={styles.container}>
        {submittedThid ? renderPostSubmissionView() : renderFormView()}
      </View>
    </ScrollView>
  );
};

export default OrgNewCustomerScreen;
