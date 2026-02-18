import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import ThemedText from '../ThemedText';
import ThemedInput from '../ThemedTextInput';
import ThemedPicker from '../ThemedPicker';
import ThemedCheckbox from '../ThemedCheckbox';
import ThemedButton from '../ThemedButton';
import FilePickerButton from '../FilePickerButton';
import { useThemeColor } from '../../hooks/useThemeColor';

type PickerItem = { label: string; value: string };

// TODO: move this labels contract to gdc-sdk-client-ts (or gdc-common-utils-ts)
// so any frontend (web/mobile/partner apps) can reuse the same i18n key shape.
type PersonalEvidenceLabels = {
  contextTitle: string;
  indexSectionLabel: string;
  creatorDidLabel: string;
  subjectDidLabel: string;
  confidentialTitle: string;
  portalUrlLabel: string;
  portalUrlPlaceholder: string;
  addDocumentButton: string;
  openDataTitle: string;
  resourceTypeLabel: string;
  textDescriptionLabel: string;
  textDescriptionPlaceholder: string;
  textDescriptionHint: string;
  extractCodeButton: string;
  codingSystemLabel: string;
  codeLabel: string;
  periodLabel: string;
  startDateLabel: string;
  endDateLabel: string;
  jurisdictionLabel: string;
  profileLabel: string;
  yearOfBirthLabel: string;
  sexOrGenderLabel: string;
  actionsTitle: string;
  signEvidenceLabel: string;
  registerOnBlockchainLabel: string;
  qualifiedCreatorStatusLabel: string;
  qualifiedCreatorYesLabel: string;
  qualifiedCreatorNoLabel: string;
  attestationLabel: string;
  researchMetadataPolicyHint: string;
  communicationToggleLabel: string;
  recipientsLabel: string;
  recipientsPlaceholder: string;
  communicationTextLabel: string;
  communicationTextPlaceholder: string;
  submitDocumentOnlyButton: string;
  submitWithCommunicationButton: string;
};

export type PersonalEvidenceDraft = {
  indexSection: string;
  creatorDid: string;
  subjectDid: string;
  yearOfBirth: string;
  sexOrGender: string;
  profile: 'org.hl7.fhir.r4' | 'org.hl7.fhir.api';
  confidential: {
    portalUrl?: string;
    attachments: DocumentPicker.DocumentPickerAsset[];
  };
  openData: {
    resourceType: string;
    textDescription: string;
    codingSystem: string;
    code: string;
    period: boolean;
    startDate?: string;
    endDate?: string;
    jurisdiction: string;
  };
  actions: {
    signEvidence: boolean;
    registerOnBlockchain: boolean;
    qualifiedCreator: boolean;
    registerResearchMetadata: boolean;
  };
  communication?: {
    recipients: string[];
    text?: string;
  };
};

type PersonalEvidenceComposerProps = {
  indexSection: string;
  creatorDid: string;
  subjectDid: string;
  yearOfBirth: string;
  sexOrGender: string;
  labels: PersonalEvidenceLabels;
  resourceTypeOptions: PickerItem[];
  codingSystemOptions: PickerItem[];
  codesByCodingSystem: Record<string, PickerItem[]>;
  jurisdictionOptions: PickerItem[];
  initialJurisdiction?: string;
  isQualifiedCreator: boolean;
  onSubmit: (draft: PersonalEvidenceDraft) => void;
};

export default function PersonalEvidenceComposer({
  indexSection,
  creatorDid,
  subjectDid,
  yearOfBirth,
  sexOrGender,
  labels,
  resourceTypeOptions,
  codingSystemOptions,
  codesByCodingSystem,
  jurisdictionOptions,
  initialJurisdiction,
  isQualifiedCreator,
  onSubmit,
}: PersonalEvidenceComposerProps) {
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  const [portalUrl, setPortalUrl] = useState('');
  const [attachments, setAttachments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [resourceType, setResourceType] = useState(resourceTypeOptions[0]?.value || '');
  const [textDescription, setTextDescription] = useState('');
  const [codingSystem, setCodingSystem] = useState(codingSystemOptions[0]?.value || '');
  const [code, setCode] = useState('');
  const [period, setPeriod] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [jurisdiction, setJurisdiction] = useState(initialJurisdiction || jurisdictionOptions[0]?.value || '');
  const [profile, setProfile] = useState<'org.hl7.fhir.r4' | 'org.hl7.fhir.api'>('org.hl7.fhir.r4');
  const [signEvidence, setSignEvidence] = useState(true);
  const [registerOnBlockchain, setRegisterOnBlockchain] = useState(false);
  const [reviewAttestation, setReviewAttestation] = useState(false);
  const [sendCommunication, setSendCommunication] = useState(false);
  const [recipientsText, setRecipientsText] = useState('');
  const [communicationText, setCommunicationText] = useState('');

  const codeOptions = useMemo(() => {
    return codesByCodingSystem[codingSystem] || [];
  }, [codingSystem, codesByCodingSystem]);

  const cardStyle = useMemo(
    () => [styles.card, { backgroundColor: cardBackground, borderColor }],
    [cardBackground, borderColor],
  );

  const shouldRegisterResearchMetadata =
    isQualifiedCreator &&
    attachments.length > 0 &&
    Boolean(code) &&
    reviewAttestation;

  const handleSubmit = () => {
    const recipients = recipientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    onSubmit({
      indexSection,
      creatorDid,
      subjectDid,
      yearOfBirth,
      sexOrGender,
      profile,
      confidential: {
        portalUrl: portalUrl.trim() || undefined,
        attachments,
      },
      openData: {
        resourceType,
        textDescription: textDescription.trim(),
        codingSystem,
        code,
        period,
        startDate: startDate.trim() || undefined,
        endDate: period ? endDate.trim() || undefined : undefined,
        jurisdiction,
      },
      actions: {
        signEvidence,
        registerOnBlockchain,
        qualifiedCreator: isQualifiedCreator,
        registerResearchMetadata: shouldRegisterResearchMetadata,
      },
      communication: sendCommunication
        ? {
            recipients,
            text: communicationText.trim() || undefined,
          }
        : undefined,
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={cardStyle}>
        <ThemedText style={styles.cardTitle}>{labels.contextTitle}</ThemedText>
        <ThemedText style={styles.label}>{labels.indexSectionLabel}</ThemedText>
        <ThemedInput value={indexSection} disabled />
        <ThemedText style={styles.label}>{labels.creatorDidLabel}</ThemedText>
        <ThemedInput value={creatorDid} disabled />
        <ThemedText style={styles.label}>{labels.subjectDidLabel}</ThemedText>
        <ThemedInput value={subjectDid} disabled />
      </View>

      <View style={cardStyle}>
        <ThemedText style={styles.cardTitle}>{labels.confidentialTitle}</ThemedText>
        <ThemedText style={styles.label}>{labels.portalUrlLabel}</ThemedText>
        <ThemedInput
          placeholder={labels.portalUrlPlaceholder}
          value={portalUrl}
          onChangeText={setPortalUrl}
          autoCapitalize="none"
          keyboardType="url"
        />
        <FilePickerButton
          title={labels.addDocumentButton}
          onFilePick={(files) => setAttachments(files || [])}
          maxFiles={4}
          allowedMimeTypes={['application/pdf', 'application/fhir+json', 'application/json', 'text/plain']}
        />
      </View>

      <View style={cardStyle}>
        <ThemedText style={styles.cardTitle}>{labels.openDataTitle}</ThemedText>
        <ThemedText style={styles.label}>{labels.resourceTypeLabel}</ThemedText>
        <ThemedPicker selectedValue={resourceType} onValueChange={setResourceType} items={resourceTypeOptions} />

        <ThemedText style={styles.label}>{labels.textDescriptionLabel}</ThemedText>
        <ThemedInput
          placeholder={labels.textDescriptionPlaceholder}
          value={textDescription}
          onChangeText={setTextDescription}
          multiline
          numberOfLines={4}
          style={styles.multilineInput}
        />
        <ThemedText style={styles.hint}>{labels.textDescriptionHint}</ThemedText>
        <ThemedButton title={labels.extractCodeButton} onPress={() => {}} disabled type="outline" />

        <ThemedText style={styles.label}>{labels.codingSystemLabel}</ThemedText>
        <ThemedPicker
          selectedValue={codingSystem}
          onValueChange={(value) => {
            setCodingSystem(value);
            setCode('');
          }}
          items={codingSystemOptions}
        />

        <ThemedText style={styles.label}>{labels.codeLabel}</ThemedText>
        <ThemedPicker selectedValue={code} onValueChange={setCode} items={codeOptions} />

        <ThemedCheckbox checked={period} onToggle={() => setPeriod((v) => !v)} label={labels.periodLabel} />
        <ThemedText style={styles.label}>{labels.startDateLabel}</ThemedText>
        <ThemedInput value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />

        {period ? (
          <>
            <ThemedText style={styles.label}>{labels.endDateLabel}</ThemedText>
            <ThemedInput value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" />
          </>
        ) : null}

        <ThemedText style={styles.label}>{labels.jurisdictionLabel}</ThemedText>
        <ThemedPicker selectedValue={jurisdiction} onValueChange={setJurisdiction} items={jurisdictionOptions} />

        <ThemedText style={styles.label}>{labels.profileLabel}</ThemedText>
        <ThemedPicker
          selectedValue={profile}
          onValueChange={(value) => setProfile(value)}
          items={[
            { label: 'FHIR R4 (versioned clinical document)', value: 'org.hl7.fhir.r4' },
            { label: 'FHIR API (version-agnostic interoperable claims)', value: 'org.hl7.fhir.api' },
          ]}
        />

        <ThemedText style={styles.label}>{labels.sexOrGenderLabel}</ThemedText>
        <ThemedInput value={sexOrGender} disabled />
        <ThemedText style={styles.label}>{labels.yearOfBirthLabel}</ThemedText>
        <ThemedInput value={yearOfBirth} disabled />
      </View>

      <View style={cardStyle}>
        <ThemedText style={styles.cardTitle}>{labels.actionsTitle}</ThemedText>
        <ThemedCheckbox checked={signEvidence} onToggle={() => setSignEvidence((v) => !v)} label={labels.signEvidenceLabel} />
        <ThemedCheckbox
          checked={registerOnBlockchain}
          onToggle={() => setRegisterOnBlockchain((v) => !v)}
          label={labels.registerOnBlockchainLabel}
        />
        <ThemedText style={styles.label}>{labels.qualifiedCreatorStatusLabel}</ThemedText>
        <ThemedInput value={isQualifiedCreator ? labels.qualifiedCreatorYesLabel : labels.qualifiedCreatorNoLabel} disabled />
        <ThemedCheckbox
          checked={reviewAttestation}
          onToggle={() => setReviewAttestation((v) => !v)}
          label={labels.attestationLabel}
          disabled={!isQualifiedCreator}
        />
        <ThemedText style={styles.hint}>{labels.researchMetadataPolicyHint}</ThemedText>
      </View>

      <View style={cardStyle}>
        <ThemedCheckbox
          checked={sendCommunication}
          onToggle={() => setSendCommunication((v) => !v)}
          label={labels.communicationToggleLabel}
        />
        {sendCommunication ? (
          <>
            <ThemedText style={styles.label}>{labels.recipientsLabel}</ThemedText>
            <ThemedInput
              placeholder={labels.recipientsPlaceholder}
              value={recipientsText}
              onChangeText={setRecipientsText}
              multiline
              numberOfLines={3}
              style={styles.multilineInput}
            />
            <ThemedText style={styles.label}>{labels.communicationTextLabel}</ThemedText>
            <ThemedInput
              placeholder={labels.communicationTextPlaceholder}
              value={communicationText}
              onChangeText={setCommunicationText}
              multiline
              numberOfLines={3}
              style={styles.multilineInput}
            />
          </>
        ) : null}
      </View>

      <ThemedButton
        title={sendCommunication ? labels.submitWithCommunicationButton : labels.submitDocumentOnlyButton}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  hint: {
    opacity: 0.75,
    marginBottom: 10,
    fontSize: 12,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
