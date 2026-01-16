// screens/organization/communications/OrgNewConnectionScreen.js
import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { useAccessibilityContext } from '../../../context/AccessibilityContext';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { getScreenStyles } from '../../../constants/Styles';
import ScreenHeader from '../../../components/ScreenHeader';
import ThemedText from '../../../components/ThemedText';
import ThemedInput from '../../../components/ThemedTextInput';
import ThemedPicker from '../../../components/ThemedPicker';
import ThemedButton from '../../../components/ThemedButton';
import GroupPermissionSelector from '../../../components/GroupPermissionSelector';
import { useJobs } from '../../../context/JobContext';
import { Routes } from '../../../constants/Routes';

const OrgNewConnectionScreen = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const white = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'text');
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState('document');
  const [localSearchThid, setLocalSearchThid] = useState(null);

  // Form state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [docType, setDocType] = useState('uhid');
  const [docId, setDocId] = useState('');
  const [docSubRegion, setDocSubRegion] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [dob, setDob] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);

  const { isJobSystemReady, allJobs, createJob, sync } = useJobs();

  // Check for a preselected DID from route params (e.g., after customer registration)
  const preselectedDid = route.params?.preselectedDid;

  // This state will hold a "fake" job object if a DID is preselected
  const [preselectedSearchJob, setPreselectedSearchJob] = useState(null);

  useEffect(() => {
    if (preselectedDid) {
      setPreselectedSearchJob({
        id: 'preselected-job',
        content: {
          status: 'success',
          result: { id: preselectedDid },
        },
      });
    }
  }, [preselectedDid]);

  const currentSearchJob = useMemo(() => {
    // If we have a preselected DID, we use its fake job object.
    if (preselectedSearchJob) return preselectedSearchJob;

    if (!localSearchThid || !allJobs) return null;
    return allJobs.find(job => job && job.id === localSearchThid);
  }, [allJobs, localSearchThid, preselectedSearchJob]);

  useEffect(() => {
    if (isFocused && currentSearchJob?.content.status === 'success') {
      // Keep showing the result
    } else if (!isFocused) {
      // Reset when leaving the screen
      setLocalSearchThid(null);
    }
  }, [isFocused, currentSearchJob]);

  const identifierKeys = [
    'did-web', 'dl', 'jhn', 'pi', 'mb', 'visa', 
    'wp', 'sp', 'dr', 'ppn', 'nn'
  ];

  const docTypes = identifierKeys.map(key => ({
    label: t(`forms.identifierTypeLabels.${key}`),
    value: key,
  }));

  const handleSearch = async () => {
    if (!isJobSystemReady) return;
    let searchBody = {};
    if (activeTab === 'email' && (email || phone)) searchBody = { email, phone };
    else if (activeTab === 'document' && docId) searchBody = { docType, docId, docSubRegion };
    else if (activeTab === 'name' && firstName && lastName) searchBody = { firstName, lastName, secondLastName, dob };
    else return;

    const newJob = await createJob({
      serviceId: 'v1_health-care_test-network_org.schema_Person_discovery',
      payload: { type: 'https://didcomm.org/user-search/1.0/search', body: searchBody },
      notification: {
        title: t('organization.screens.newConnection.notification.title'),
        message: t('organization.screens.newConnection.notification.message'),
        navigateTo: Routes.Organization.AddConnection.name,
      }
    });
    if (newJob) {
      setLocalSearchThid(newJob.id);
    }
  };
  
  const renderForm = () => (
    <View>
      {activeTab === 'email' && (
        <View>
          <ThemedText style={styles.formLabel}>{t('organization.screens.newConnection.emailLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.newConnection.emailPlaceholder')} keyboardType="email-address" value={email} onChangeText={setEmail} editable={!phone} />
          <View style={styles.formSeparatorContainer}><ThemedText style={[styles.textCenter, styles.formSeparatorText]}>{t('organization.screens.newConnection.orSeparator')}</ThemedText></View>
          <ThemedText style={styles.formLabel}>{t('organization.screens.newConnection.phoneLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.newConnection.phonePlaceholder')} keyboardType="phone-pad" value={phone} onChangeText={setPhone} editable={!email} />
        </View>
      )}
      {activeTab === 'document' && (
        <View>
          <ThemedText style={styles.formLabel}>{t('common.forms.docTypeLabel')}</ThemedText>
          <ThemedPicker selectedValue={docType} onValueChange={setDocType} items={docTypes} placeholder="-- Select Document Type --" />
          {docType === 'DL' && (
            <><ThemedText style={styles.formLabel}>{t('organization.screens.newConnection.docSubRegionLabel')}</ThemedText><ThemedInput placeholder={t('organization.screens.newConnection.docSubRegionPlaceholder')} value={docSubRegion} onChangeText={setDocSubRegion} /></>
          )}
          <ThemedText style={styles.formLabel}>{t('organization.screens.newConnection.docIdLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.newConnection.docIdPlaceholder')} value={docId} onChangeText={setDocId} />
        </View>
      )}
      {activeTab === 'name' && (
        <View>
          <ThemedText style={styles.formLabel}>{t('organization.screens.newConnection.nameLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.newConnection.namePlaceholder')} value={firstName} onChangeText={setFirstName} />
          <ThemedText style={styles.formLabel}>{t('organization.screens.newConnection.lastNameLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.newConnection.lastNamePlaceholder')} value={lastName} onChangeText={setLastName} />
          <ThemedText style={styles.formLabel}>{t('organization.screens.newConnection.secondLastNameLabel')}</ThemedText>
          <ThemedInput placeholder={t('organization.screens.newConnection.secondLastNamePlaceholder')} value={secondLastName} onChangeText={setSecondLastName} />
          <ThemedText style={styles.formLabel}>{t('organization.screens.newConnection.dobLabel')}</ThemedText>
          <ThemedInput placeholder="YYYY-MM-DD" value={dob} onChangeText={setDob} />
        </View>
      )}
    </View>
  );

  const renderPermissionsForm = (job) => {
    const userFound = job.content.result;

    const handleCreateConnection = () => {
      if (selectedGroups.length === 0) {
        Alert.alert(
          t('common.validation'),
          t('organization.screens.newConnection.noGroupsSelected')
        );
        return;
      }

      createJob({
        // TODO: Define a proper serviceId for connection creation
        serviceId: 'v1_health-care_test-network_org.schema_Connection_create',
        payload: {
          type: 'https://didcomm.org/connection-protocol/1.0/create',
          body: {
            targetDid: userFound.id,
            groupIds: selectedGroups,
          }
        },
        notification: {
          title: t('organization.screens.newConnection.connectionJob.title'),
          message: t('organization.screens.newConnection.connectionJob.message'),
        }
      });

      Alert.alert(
        t('organization.screens.newConnection.connectionSuccess.title'),
        t('organization.screens.newConnection.connectionSuccess.message')
      );
      
      // Reset the search and navigate back or to the contacts list
      setLocalSearchThid(null);
      navigation.goBack();
    };

    return (
      <View>
        <ThemedText style={[styles.title, { color: textColor, marginBottom: 4 }]}>
          {t('organization.screens.newConnection.permissionsTitle')}
        </ThemedText>
        <ThemedText style={{ color: textColor, marginBottom: 20 }}>
          {t('organization.screens.newConnection.userFoundPrefix')} 
          <ThemedText style={{ fontWeight: 'bold' }}>{userFound?.id || 'ID Received'}</ThemedText>
        </ThemedText>
        
        <GroupPermissionSelector onSelectionChange={setSelectedGroups} />

        <View style={{ height: 32 }} />

        <ThemedButton 
          title={t('organization.screens.newConnection.createConnectionButton')} 
          onPress={handleCreateConnection} 
          disabled={selectedGroups.length === 0}
          accessibilityLabel={t('organization.screens.newConnection.createConnectionButton')}
          accessibilityRole="button"
        />
      </View>
    );
  };

  const renderSearchForm = () => {
    const jobStatus = currentSearchJob?.content.status;
    const isSearching = jobStatus === 'draft' || jobStatus === 'pending';
    const canSearch = isJobSystemReady && !isSearching;
    const searchFailed = jobStatus === 'error' || (jobStatus === 'success' && !currentSearchJob.content.result);

    return (
      <View>
        <ThemedText style={styles.tabGroupLabel}>{t('organization.screens.newConnection.searchByLabel')}</ThemedText>
        <View style={[styles.tabGroupContainer, { borderColor }]}>
          <View style={styles.tabGroup}>
                      <Pressable accessible accessibilityRole="button" accessibilityLabel={t('organization.screens.newConnection.tabs.document')} onPress={() => setActiveTab('document')} style={[styles.inactiveTab, activeTab === 'document' && [styles.activeTab, { backgroundColor: primaryColor }]]}><ThemedText style={activeTab === 'document' ? [styles.activeTabText, { color: white }] : [styles.inactiveTabText, { color: textColor }]}>{t('organization.screens.newConnection.tabs.document')}</ThemedText></Pressable>
          <Pressable accessible accessibilityRole="button" accessibilityLabel={t('organization.screens.newConnection.tabs.name')} onPress={() => setActiveTab('name')} style={[styles.inactiveTab, activeTab === 'name' && [styles.activeTab, { backgroundColor: primaryColor }]]}><ThemedText style={activeTab === 'name' ? [styles.activeTabText, { color: white }] : [styles.inactiveTabText, { color: textColor }]}>{t('organization.screens.newConnection.tabs.name')}</ThemedText></Pressable>
          <Pressable accessible accessibilityRole="button" accessibilityLabel={t('organization.screens.newConnection.tabs.email')} onPress={() => setActiveTab('email')} style={[styles.inactiveTab, activeTab === 'email' && [styles.activeTab, { backgroundColor: primaryColor }]]}><ThemedText style={activeTab === 'email' ? [styles.activeTabText, { color: white }] : [styles.inactiveTabText, { color: textColor }]}>{t('organization.screens.newConnection.tabs.email')}</ThemedText></Pressable>
          </View>
        </View>
        {renderForm()}
        {searchFailed && (
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <ThemedText style={{ color: 'red', textAlign: 'center' }}>{t('organization.screens.newConnection.notFound')}</ThemedText>
            <ThemedButton 
              title={t('organization.screens.newConnection.registerButton')}
              onPress={() => navigation.navigate(Routes.Organization.RegisterUnifiedIndex.name)}
              style={{ marginTop: 15 }}
            />
          </View>
        )}
        {isSearching ? (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={primaryColor} />
            <ThemedText style={{ marginTop: 10 }}>{t('organization.screens.newConnection.searching')}</ThemedText>
          </View>
        ) : (
          <ThemedButton title={t('organization.screens.newConnection.searchButton')} onPress={handleSearch} disabled={!canSearch} accessibilityLabel={t('organization.screens.newConnection.searchButton')} accessibilityRole="button" />
        )}
      </View>
    );
  };
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <ScreenHeader title={t('organization.screens.newConnection.title')} subtitle={t('organization.screens.newConnection.subtitle')} />
      <View style={styles.container}>
        {currentSearchJob && currentSearchJob.content.status === 'success' && currentSearchJob.content.result
          ? renderPermissionsForm(currentSearchJob)
          : renderSearchForm()
        }
      </View>
    </ScrollView>
  );
};

export default OrgNewConnectionScreen;
