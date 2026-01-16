// components/ConsentForm5.js

/**
 * 🏠 Architecture Overview
 *
 * 🚩 PURPOSE:
 * This app is structured around two main user flows: **Family** and **Organization**.
 * LandingScreen is the entry point and offers access to both.
 * 
 * 🔄 WHY THIS MATTERS:
 * - Consistent interface
 * - Centralized accessibility & theming
 * - Clear separation between Family / Organization flows
 * - Easy to maintain or extend
 *
 * 🔧 DIRECTORY STRUCTURE (IMPORT PATHS):
 * ├── App.js                             ← App entry point
 * ├── navigation/
 * │   ├── RootNavigator.js               ← Global navigation
 * │   ├── FamNavigator.js                ← Family flow navigation
 * │   └── OrgNavigator.js                ← Organization flow navigation
 * ├── screens/
 * │   ├── LandingScreen.js               ← Entry screen (Landing)
 * │   └── family/
 * │       ├── FamilyDashboardScreen.js
 * │       ├── MyFamilyScreen.js
 * │       ├── FamilyConsentScreen.js
 * │       └── other Family screens...
 * │   └── organization/
 * │       ├── OrganizationDashboardScreen.js
 * │       └── other Organization screens...
 * ├── components/
 * │   ├── ThemedButton.js
 * │   ├── ThemedCard.js
 * │   ├── ThemedCheckbox.js
 * │   ├── ThemedPicker.js
 * │   ├── ThemedText.js
 * │   ├── ThemedTextInput.js
 * │   ├── ThemedView.js 
 * │   ├── AccessibleButtonGrid.js
 * │   └── ScreenHeader.js  ← Reusable (logo, title, subtitle)
 * ├── constants/
 * │   ├── Routes.js                  ← All navigation route names and paths
 * │   ├── Colors.js                  ← Light/Dark mode colors
 * │   ├── Styles.js                  ← Scaling styles with S / M / L
 * │   └── Buttons/
 * │       ├── LandingButtons.js      ← Landing screen buttons
 * │       ├── FamilyButtons.js       ← Family flow buttons
 * │       └── OrgButtons.js          ← Organization flow buttons
 * ├── context/
 * │   └── AccessibilityContext.js    ← Provides interfaceSize (S/M/L), colorTheme, scaleFactor
 * ├── hooks/
 * │   └── useThemeColor.js           ← Dynamic light/dark color helper
 * ├── utils/
 * │   └── scale.js                   ← Get interface size from PixelRatio
 *
 * 🚩 ACCESSIBILITY & SCALING:
 * 1️⃣ `AccessibilityContext` provides:
 *    - interfaceSize: 'S' / 'M' / 'L'
 *    - colorTheme: 'light' / 'dark'
 *    - scaleFactor: 1 / 1.2 / 1.4
 * 2️⃣ `getScreenStyles(scaleFactor)` centralizes spacing, fonts
 * 3️⃣ `ThemedButton`, `ThemedTextInput`, `ThemedText` scale dynamically
 *
 * 🚩 DESIGN PATTERN:
 * - `ScreenHeader`: handles logo, title, subtitle, scales automatically
 * - `AccessibleButtonGrid`: renders navigation buttons with icons and labels
 * - ScrollViews use `styles.scrollContainer` for padding and scaling
 * - Buttons come from constants per flow (`FamilyButtons`, `OrgButtons`, `LandingButtons`)
 *
 *
 */

import { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CountryPicker from 'react-native-country-picker-modal';
import Collapsible from 'react-native-collapsible';
import { v4 as uuidv4 } from 'uuid';

import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { usePurposeLogic } from '../hooks/usePurposeLogic';
import { getScreenStyles } from '../constants/Styles';
import ThemedButton from './ThemedButton';
import ThemedText from './ThemedText';
import ThemedInput from './ThemedTextInput';
import ThemedCheckbox from './ThemedCheckbox';
import { createNewRule, updateRuleDigest } from 'gdc-sdk-client-ts';
import { dataSectors, i18sectionsEN, i18rolesEN } from '../data/sectors';
import { getFlagEmoji } from '../utils/countries';
import { testClaimsPatientSubjectDocumentSigned } from '../utils/test-data';

const subjectSex = testClaimsPatientSubjectDocumentSigned["org.hl7.fhir.api.patient.sex-parameter-for-clinical-use"] || '';

export default function ConsentForm5() {
  const { accessibility } = useAccessibilityContext();
  const interfaceSize = accessibility.interfaceSize || 'M';
  const scaleFactor = interfaceSize === 'S' ? 1 : interfaceSize === 'L' ? 1.4 : 1.2;
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const [sector, setSector] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [granteeType, setGranteeType] = useState('');
  const [decision, setDecision] = useState('permit');
  const [countryCode, setCountryCode] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [legalIdType, setLegalIdType] = useState('');
  const [legalIdValue, setLegalIdValue] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [blockchainOptIn, setBlockchainOptIn] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpEntered, setOtpEntered] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [modalTxId, setModalTxId] = useState('');
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = Dimensions.get('window').width;
      setColumnCount(width > 800 ? 3 : width > 500 ? 2 : 1);
    };
    updateColumns();
    const subscription = Dimensions.addEventListener('change', updateColumns);
    return () => subscription?.remove();
  }, []);

  const {
    presets,
    filteredSections,
    filteredRoles,
    defaultSections,
    defaultRoles,
    allowBlockchainRegister
  } = usePurposeLogic({
    subjectSex,
    sector,
    selectedPurpose,
    rules,
    editingIndex
  });
  const addCountry = (code) => {
    if (!selectedCountries.includes(code)) {
      setSelectedCountries([...selectedCountries, code]);
    }
  };

  const removeCountry = (code) => {
    setSelectedCountries(selectedCountries.filter((c) => c !== code));
  };

  const handleAddEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    if (!emailList.includes(trimmed)) {
      setEmailList([...emailList, trimmed]);
    }
    setEmailInput('');
  };

  const handleToggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleToggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleBlockchainRegister = () => {
    const updated = rules.map((r) => {
      const meta = r.meta || {};
      if (!meta.txId) {
        return {
          ...r,
          status: 'active',
          meta: {
            ...meta,
            txId: 'txid-' + uuidv4(),
            lastUpdated: new Date().toISOString(),
          },
        };
      }
      return r;
    });
    setRules(updated);
    setRegistrationMessage('✅ Successfully registered on blockchain.');
    setBlockchainOptIn(false);
    setOtpRequested(false);
    setOtpEntered('');
  };

  const currentSector = dataSectors.find((s) => s.type === sector);

  const isAddEnabled = title.trim() && selectedRoles.length > 0 && (
    (granteeType === 'jurisdiction' && selectedCountries.length > 0) ||
    (granteeType === 'organization' && countryCode && legalIdType && legalIdValue.trim()) ||
    (granteeType === 'email' && emailList.length > 0)
  );

  const resetForm = () => {
    setTitle('');
    setDecision('permit');
    setGranteeType('');
    setCountryCode('');
    setSelectedCountries([]);
    setLegalIdType('');
    setLegalIdValue('');
    setEmailInput('');
    setEmailList([]);
    setSelectedRoles([]);
    setSelectedSections([]);
    setSelectedPurpose('');
    setEditingIndex(-1);
    setBlockchainOptIn(false);
    setOtpRequested(false);
    setOtpEntered('');
    setRegistrationMessage('');
  };

  const renderCheckboxGrid = (items, selected, toggleFn, labels) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
      {items.map((item) => (
        <View key={item} style={{ width: `${100 / columnCount}%`, flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <ThemedCheckbox checked={selected.includes(item)} onToggle={() => toggleFn(item)} />
          <ThemedText style={{ marginLeft: 6 }}>{labels[item] || item}</ThemedText>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor, padding: 16 }}>
      <ThemedText variant="title">Consent Management</ThemedText>

      <ThemedText>Select Sector</ThemedText>
      <View style={{ borderWidth: 1, borderColor, borderRadius: 8, marginBottom: 16 }}>
        <Picker selectedValue={sector} onValueChange={setSector} dropdownIconColor={textColor}>
          <Picker.Item label="-- Select --" value="" />
          {dataSectors.map((s) => (
            <Picker.Item key={s.type} label={s.type} value={s.type} />
          ))}
        </Picker>
      </View>

      <ThemedText>Grantee Type</ThemedText>
      <View style={{ borderWidth: 1, borderColor, borderRadius: 8, marginBottom: 16 }}>
        <Picker selectedValue={granteeType} onValueChange={setGranteeType} dropdownIconColor={textColor}>
          <Picker.Item label="-- Select --" value="" />
          <Picker.Item label="Jurisdiction + Roles" value="jurisdiction" />
          <Picker.Item label="Organization + Roles" value="organization" />
          <Picker.Item label="Email + Roles" value="email" />
        </Picker>
      </View>

      <ThemedText>Purpose of Use</ThemedText>
      <View style={{ borderWidth: 1, borderColor, borderRadius: 8, marginBottom: 16 }}>
        <Picker
          selectedValue={selectedPurpose}
          onValueChange={(value) => {
            setSelectedPurpose(value);
            setSelectedRoles(presets[value]?.allowedRoles || []);
            setSelectedSections(presets[value]?.defaultSelectedSections || []);
          }}
          dropdownIconColor={textColor}
        >
          <Picker.Item label="--" value="" />
          {Object.entries(presets).map(([code, { label }]) => (
            <Picker.Item key={code} label={label} value={code} />
          ))}
        </Picker>
      </View>

      <ThemedText>Grantee Type</ThemedText>
      <View style={{ borderWidth: 1, borderColor, borderRadius: 8, marginBottom: 16 }}>
        <Picker selectedValue={granteeType} onValueChange={setGranteeType} dropdownIconColor={textColor}>
          <Picker.Item label="-- Select --" value="" />
          <Picker.Item label="Jurisdiction + Roles" value="jurisdiction" />
          <Picker.Item label="Organization + Roles" value="organization" />
          <Picker.Item label="Email + Roles" value="email" />
        </Picker>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
        <Pressable onPress={() => setDecision('permit')}>
          <ThemedText>{decision === 'permit' ? '✅ Permit' : 'Permit'}</ThemedText>
        </Pressable>
        <Pressable onPress={() => setDecision('deny')}>
          <ThemedText>{decision === 'deny' ? '🚫 Deny' : 'Deny'}</ThemedText>
        </Pressable>
      </View>

      <ThemedText>Rule Title</ThemedText>
      <ThemedInput placeholder="e.g. Allow emergency access" value={title} onChangeText={setTitle} />

      {granteeType === 'jurisdiction' && (
        <>
          <ThemedText>Jurisdiction (Country)</ThemedText>
          <CountryPicker withFilter withFlag withCountryNameButton onSelect={(c) => {
            setCountryCode(c.cca2);
            addCountry(c.cca2);
          }} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
            {selectedCountries.map((code) => (
              <Pressable key={code} onPress={() => removeCountry(code)} style={{ backgroundColor: '#ddd', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 6 }}>
                <ThemedText>{getFlagEmoji(code)} {code} ✕</ThemedText>
              </Pressable>
            ))}
          </View>
        </>
      )}
      {granteeType === 'organization' && (
        <>
          <ThemedText>Jurisdiction (Country)</ThemedText>
          <CountryPicker withFilter withFlag withCountryNameButton onSelect={(c) => setCountryCode(c.cca2)} />
          <ThemedText>Legal Identifier Type</ThemedText>
          <View style={{ borderWidth: 1, borderColor, borderRadius: 8, marginBottom: 16 }}>
            <Picker selectedValue={legalIdType} onValueChange={setLegalIdType}>
              <Picker.Item label="--" value="" />
              <Picker.Item label="EIN" value="EIN" />
              <Picker.Item label="TAX" value="TAX" />
              <Picker.Item label="VAT" value="VAT" />
            </Picker>
          </View>
          <ThemedText>Legal Identifier</ThemedText>
          <ThemedInput placeholder="e.g. 12-3456789" value={legalIdValue} onChangeText={setLegalIdValue} />
        </>
      )}

      {granteeType === 'email' && (
        <>
          <ThemedText>Authorized Email</ThemedText>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <ThemedInput placeholder="e.g. user@example.com" value={emailInput} onChangeText={setEmailInput} style={{ flex: 1 }} />
            <ThemedButton title="➕" onPress={handleAddEmail} />
          </View>
          {emailList.map((email) => (
            <View key={email} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eee', padding: 8, marginBottom: 4, borderRadius: 6 }}>
              <ThemedText>{email}</ThemedText>
              <Pressable onPress={() => setEmailList(emailList.filter((e) => e !== email))}>
                <ThemedText>✕</ThemedText>
              </Pressable>
            </View>
          ))}
        </>
      )}

      {currentSector?.sections?.length > 0 && (
        <>
          <Pressable onPress={() => setSectionsOpen((prev) => !prev)}>
            <ThemedText>{sectionsOpen ? '▼ Sections' : '▶ Sections'}</ThemedText>
          </Pressable>
          <Collapsible collapsed={!sectionsOpen}>
            {renderCheckboxGrid(currentSector.sections, selectedSections, handleToggleSection, i18sectionsEN)}
          </Collapsible>
        </>
      )}

      {currentSector?.roles?.length > 0 && (
        <>
          <Pressable onPress={() => setRolesOpen((prev) => !prev)}>
            <ThemedText>{rolesOpen ? '▼ Roles' : '▶ Roles'}</ThemedText>
          </Pressable>
          <Collapsible collapsed={!rolesOpen}>
            {renderCheckboxGrid(currentSector.roles, selectedRoles, handleToggleRole, i18rolesEN)}
          </Collapsible>
        </>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16 }}>
        <ThemedButton title="💾 Save Rule" onPress={() => {
          const baseRule = {
            title: title.trim(),
            decision,
            sector,
            granteeType,
            countries: selectedCountries,
            roles: selectedRoles,
            sections: selectedSections,
            legalIdType,
            legalIdValue,
            countryCode,
            emails: emailList,
          };
          const isDuplicate = rules.some((r, i) => r.title === baseRule.title && i !== editingIndex);
          if (!baseRule.title || (isDuplicate && editingIndex < 0)) {
            setRegistrationMessage('⚠️ Title is required and must be unique.');
            return;
          }
          let rule;
          if (editingIndex >= 0) {
            const original = rules[editingIndex];
            rule = updateRuleDigest({ ...original, ...baseRule });
          } else {
            rule = createNewRule({ ...baseRule, status: 'draft' });
          }
          const updated = [...rules];
          if (editingIndex >= 0) {
            updated[editingIndex] = rule;
          } else {
            updated.push(rule);
          }
          setRules(updated);
          resetForm();
        }} disabled={!isAddEnabled} />
        {editingIndex >= 0 && <ThemedButton title="↩ Cancel" onPress={resetForm} />}
      </View>

      {rules.length > 0 && (
        <View>
          <ThemedText variant="subtitle">Defined Rules</ThemedText>
          {rules.map((rule, idx) => (
            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f6f6f6', padding: 10, borderRadius: 6, marginBottom: 8 }}>
              <ThemedText>{rule.decision === 'permit' ? '✅' : '🚫'} {rule.title}</ThemedText>
              <Pressable onPress={() => {
                setTitle(rule.title);
                setDecision(rule.decision);
                setSector(rule.sector);
                setGranteeType(rule.granteeType);
                setSelectedCountries(rule.countries || []);
                setLegalIdType(rule.legalIdType || '');
                setLegalIdValue(rule.legalIdValue || '');
                setEmailList(rule.emails || []);
                setSelectedRoles(rule.roles || []);
                setSelectedSections(rule.sections || []);
                setEditingIndex(idx);
                setBlockchainOptIn(false);
                setOtpRequested(false);
                setOtpEntered('');
              }}>
                <ThemedText>✏️</ThemedText>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <ThemedCheckbox checked={blockchainOptIn} onToggle={() => setShowConfirmModal(true)} />
          <ThemedText style={{ marginLeft: 8 }}>Register on Blockchain</ThemedText>
        </View>

        {blockchainOptIn && !otpRequested && <ThemedButton title="📲 Send OTP" onPress={() => setOtpRequested(true)} />}
        {otpRequested && (
          <>
            <ThemedInput placeholder="Enter OTP" value={otpEntered} onChangeText={setOtpEntered} />
            <ThemedButton title="⛓️ Register on Blockchain" onPress={handleBlockchainRegister} disabled={!otpEntered} />
          </>
        )}
        {registrationMessage !== '' && <ThemedText style={{ color: 'green', marginTop: 10 }}>{registrationMessage}</ThemedText>}
      </View>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <ThemedText>Are you sure all rules have been reviewed?</ThemedText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Pressable onPress={() => setShowConfirmModal(false)}>
                <ThemedText style={{ color: 'red' }}>Cancel</ThemedText>
              </Pressable>
              <Pressable onPress={() => { setBlockchainOptIn(true); setShowConfirmModal(false); }}>
                <ThemedText style={{ color: 'blue' }}>Continue</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showTxModal} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '85%' }}>
            <ThemedText variant="subtitle">Blockchain Transaction ID</ThemedText>
            <ThemedText>{modalTxId}</ThemedText>
            <Pressable onPress={() => setShowTxModal(false)}>
              <ThemedText style={{ color: 'blue', fontWeight: 'bold' }}>Close</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
