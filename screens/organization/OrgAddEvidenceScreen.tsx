import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';

import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/Styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import ScreenHeader from '../../components/ScreenHeader';
import PersonalEvidenceComposer, { PersonalEvidenceDraft } from '../../components/forms/PersonalEvidenceComposer';
import { useProfile } from '../../context/ProfileContext';

const OrgAddEvidenceScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<any>();
  const { profile } = useProfile();

  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  const registrationData = route.params?.registrationData || {};

  const creatorDid = profile?.did || 'did:web:provider.example.com';
  const creatorRole = (profile as any)?.role || '';
  const subjectDid = registrationData?.individualDid || 'did:web:subject.example.com:individual:pending';
  const yearOfBirth = registrationData?.yearOfBirth || '1991';
  const sexOrGender = registrationData?.gender || 'female';

  // Internal security switch. This must be derived from trusted identity/authorization policy,
  // not from user input in the UI.
  const isQualifiedCreator = Boolean(
    creatorDid &&
      (creatorDid.includes(':employee:') ||
        creatorDid.includes(':practitioner:') ||
        creatorDid.includes(':caregiver:') ||
        String(creatorRole).toLowerCase().includes('admin')),
  );

  const labels = {
    contextTitle: t('organization.addEvidence.contextTitle', 'Clinical context'),
    indexSectionLabel: t('organization.addEvidence.indexSectionLabel', 'Index section'),
    creatorDidLabel: t('organization.addEvidence.creatorDidLabel', 'Creator DID'),
    subjectDidLabel: t('organization.addEvidence.subjectDidLabel', 'Subject DID'),
    confidentialTitle: t('organization.addEvidence.confidentialTitle', 'Confidential'),
    portalUrlLabel: t('organization.addEvidence.portalUrlLabel', 'Portal URL (optional)'),
    portalUrlPlaceholder: t('organization.addEvidence.portalUrlPlaceholder', 'https://patient-portal.example.com/document/123'),
    addDocumentButton: t('organization.addEvidence.addDocumentButton', 'Attach document (optional)'),
    openDataTitle: t('organization.addEvidence.openDataTitle', 'Open Data'),
    resourceTypeLabel: t('organization.addEvidence.resourceTypeLabel', 'Resource type'),
    textDescriptionLabel: t('organization.addEvidence.textDescriptionLabel', 'Text description'),
    textDescriptionPlaceholder: t('organization.addEvidence.textDescriptionPlaceholder', 'Write one finding per line'),
    textDescriptionHint: t('organization.addEvidence.textDescriptionHint', 'Use a new line for each independent candidate resource.'),
    extractCodeButton: t('organization.addEvidence.extractCodeButton', 'Analyze and suggest code (disabled)'),
    codingSystemLabel: t('organization.addEvidence.codingSystemLabel', 'Coding system'),
    codeLabel: t('organization.addEvidence.codeLabel', 'Code'),
    periodLabel: t('organization.addEvidence.periodLabel', 'Include end date (period)'),
    startDateLabel: t('organization.addEvidence.startDateLabel', 'Start date'),
    endDateLabel: t('organization.addEvidence.endDateLabel', 'End date'),
    jurisdictionLabel: t('organization.addEvidence.jurisdictionLabel', 'Jurisdiction'),
    profileLabel: t('organization.addEvidence.profileLabel', 'Document profile'),
    yearOfBirthLabel: t('organization.addEvidence.yearOfBirthLabel', 'Year of birth (read-only)'),
    sexOrGenderLabel: t('organization.addEvidence.sexOrGenderLabel', 'Gender/Sex (read-only)'),
    actionsTitle: t('organization.addEvidence.actionsTitle', 'Evidence actions'),
    signEvidenceLabel: t('organization.addEvidence.signEvidenceLabel', 'Sign evidence'),
    registerOnBlockchainLabel: t('organization.addEvidence.registerOnBlockchainLabel', 'Register evidence on blockchain'),
    qualifiedCreatorStatusLabel: t('organization.addEvidence.qualifiedCreatorStatusLabel', 'Qualified creator status'),
    qualifiedCreatorYesLabel: t('organization.addEvidence.qualifiedCreatorYesLabel', 'Yes (derived from DID policy)'),
    qualifiedCreatorNoLabel: t('organization.addEvidence.qualifiedCreatorNoLabel', 'No (derived from DID policy)'),
    attestationLabel: t(
      'organization.addEvidence.attestationLabel',
      'I attest I reviewed the attachment and selected code matches the document',
    ),
    researchMetadataPolicyHint: t(
      'organization.addEvidence.researchMetadataPolicyHint',
      'Anonymous statistical metadata is registered only when policy conditions are met. This cannot be edited later.',
    ),
    communicationToggleLabel: t('organization.addEvidence.communicationToggleLabel', 'Also send communication'),
    recipientsLabel: t('organization.addEvidence.recipientsLabel', 'Recipients (one DID per line)'),
    recipientsPlaceholder: t('organization.addEvidence.recipientsPlaceholder', 'did:web:patient...\ndid:web:controller...'),
    communicationTextLabel: t('organization.addEvidence.communicationTextLabel', 'Communication text'),
    communicationTextPlaceholder: t('organization.addEvidence.communicationTextPlaceholder', 'Optional message for recipients'),
    submitDocumentOnlyButton: t('organization.addEvidence.submitDocumentOnlyButton', 'Create Bundle document'),
    submitWithCommunicationButton: t('organization.addEvidence.submitWithCommunicationButton', 'Create document and send communication'),
  };

  const resourceTypeOptions = [
    { label: 'Observation', value: 'Observation' },
    { label: 'Condition', value: 'Condition' },
    { label: 'MedicationStatement', value: 'MedicationStatement' },
    { label: 'AllergyIntolerance', value: 'AllergyIntolerance' },
    { label: 'DeviceUseStatement', value: 'DeviceUseStatement' },
  ];

  const codingSystemOptions = [
    { label: 'LOINC', value: 'http://loinc.org' },
    { label: 'SNOMED CT', value: 'http://snomed.info/sct' },
    { label: 'ICD-10', value: 'http://hl7.org/fhir/sid/icd-10' },
  ];

  const codesByCodingSystem = {
    'http://loinc.org': [
      { label: '8716-3 | Vital signs', value: '8716-3' },
      { label: '8867-4 | Heart rate', value: '8867-4' },
      { label: '8310-5 | Body temperature', value: '8310-5' },
    ],
    'http://snomed.info/sct': [
      { label: '386661006 | Fever', value: '386661006' },
      { label: '25064002 | Headache', value: '25064002' },
    ],
    'http://hl7.org/fhir/sid/icd-10': [
      { label: 'R50.9 | Fever, unspecified', value: 'R50.9' },
      { label: 'R51.9 | Headache', value: 'R51.9' },
    ],
  };

  const jurisdictionOptions = [
    { label: 'ES-CL', value: 'ES-CL' },
    { label: 'ES-CT', value: 'ES-CT' },
    { label: 'ES-MD', value: 'ES-MD' },
  ];

  const handleSubmit = (draft: PersonalEvidenceDraft) => {
    const mode = draft.communication ? 'document + communication' : 'document only';

    console.log('[OrgAddEvidenceScreen] draft payload:', JSON.stringify(draft, null, 2));

    Alert.alert(
      t('organization.addEvidence.successTitle', 'Draft generated'),
      t('organization.addEvidence.successMessage', `Mode: ${mode}. Bundle document is always generated.`),
    );

    // Next step (pending wiring): map this draft to SDK calls:
    // 1) Bundle/_batch for Bundle type=document
    // 2) optional Communication/_batch carrying attachment/reference
    // 3) if actions.registerResearchMetadata === true (derived by policy):
    //    push open-data metadata to jurisdiction/sector statistical channel
    //    and register document hash in researchmetadata-sc.
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title={t('organization.addEvidence.screenTitle', 'Clinical Data Composer')}
        subtitle={t(
          'organization.addEvidence.screenSubtitle',
          'Create a Bundle document with optional Communication for recipients.',
        )}
      />

      <View style={styles.container}>
        <PersonalEvidenceComposer
          indexSection={registrationData?.indexSection || registrationData?.clinicalSection || 'LOINC|8716-3'}
          creatorDid={creatorDid}
          subjectDid={subjectDid}
          yearOfBirth={yearOfBirth}
          sexOrGender={sexOrGender}
          labels={labels}
          resourceTypeOptions={resourceTypeOptions}
          codingSystemOptions={codingSystemOptions}
          codesByCodingSystem={codesByCodingSystem}
          jurisdictionOptions={jurisdictionOptions}
          initialJurisdiction="ES-CL"
          isQualifiedCreator={isQualifiedCreator}
          onSubmit={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default OrgAddEvidenceScreen;
