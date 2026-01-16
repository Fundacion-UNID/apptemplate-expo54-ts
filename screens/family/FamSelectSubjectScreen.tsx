// screens/family/FamSelectSubjectScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import ScreenHeader from '../../components/ScreenHeader';
import ThemedInput from '../../components/ThemedTextInput';
import ThemedButton from '../../components/ThemedButton';
import ThemedText from '../../components/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import { getScreenStyles } from '../../constants/style_family';
import { useProfile } from '../../context/ProfileContext';
import { useSubject } from '../../context/SubjectContext';
import { createVaultForProfile } from '../../platformServices';
import { deriveSubjectVaultId } from '../../utils/subjectVaultId';

type StoredSubject = {
  id: string;
  familyId?: string;
  subjectDid?: string;
  label?: string;
};

export default function FamSelectSubjectScreen() {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'background');
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { profileManager } = useProfile();
  const { setSubjectContext, subjectDid } = useSubject();

  const [familyId, setFamilyId] = useState('');
  const [subjectIdInput, setSubjectIdInput] = useState('');
  const [label, setLabel] = useState('');
  const [subjects, setSubjects] = useState<StoredSubject[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(async () => {
    if (!profileManager) return;
    const vault = createVaultForProfile(profileManager.profile.id);
    await vault.initialize();
    const items = (await vault.query<StoredSubject>('subjects', {})) || [];
    setSubjects(items);
  }, [profileManager]);

  useEffect(() => {
    loadSubjects().catch(() => undefined);
  }, [loadSubjects]);

  const canSave = useMemo(() => {
    return !!subjectIdInput && !!familyId;
  }, [subjectIdInput, familyId]);

  const handleSave = useCallback(async () => {
    if (!profileManager) return;
    if (!canSave) {
      setError('Missing subject or family identifier.');
      return;
    }
    setError(null);
    const vault = createVaultForProfile(profileManager.profile.id);
    await vault.initialize();
    const entry: StoredSubject = {
      id: `subject:${subjectIdInput}|family:${familyId}`,
      familyId,
      subjectDid: subjectIdInput,
      label: label || subjectIdInput,
    };
    await vault.put('subjects', entry);
    await loadSubjects();
  }, [profileManager, canSave, subjectIdInput, familyId, label, loadSubjects]);

  const handleSelect = useCallback(
    async (entry: StoredSubject) => {
      if (!profileManager) return;
      const targetSubject = entry.subjectDid || entry.id.replace(/^subject:/, '').split('|family:')[0];
      const subjectVaultId = await deriveSubjectVaultId(profileManager.profile.id, targetSubject);
      setSubjectContext({
        familyId: entry.familyId || null,
        subjectDid: targetSubject,
        subjectVaultId,
      });
    },
    [profileManager, setSubjectContext]
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={styles.scrollContainer}>
      <ScreenHeader
        title={t('family.subjects.title', 'Select subject')}
        subtitle={t('family.subjects.subtitle', 'Choose the individual whose index you are managing')}
      />

      <View style={{ width: '100%', padding: 16 }}>
        <ThemedInput
          placeholder={t('family.subjects.familyId', 'Family organization DID')}
          value={familyId}
          onChangeText={setFamilyId}
          autoCapitalize="none"
        />
        <ThemedInput
          placeholder={t('family.subjects.subjectDid', 'Subject DID')}
          value={subjectIdInput}
          onChangeText={setSubjectIdInput}
          autoCapitalize="none"
        />
        <ThemedInput
          placeholder={t('family.subjects.label', 'Label (optional)')}
          value={label}
          onChangeText={setLabel}
        />
        {error && <ThemedText style={{ marginTop: 8, opacity: 0.8 }}>{error}</ThemedText>}
        <ThemedButton
          title={t('family.subjects.save', 'Save subject')}
          onPress={handleSave}
          disabled={!canSave}
          style={{ marginTop: 12 }}
        />
      </View>

      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <ThemedText style={{ marginTop: 16, marginBottom: 8 }}>
          {t('family.subjects.list', 'Saved subjects')}
        </ThemedText>
        {subjects.length === 0 ? (
          <ThemedText style={{ opacity: 0.7 }}>{t('family.subjects.empty', 'No subjects yet.')}</ThemedText>
        ) : (
          subjects.map((entry) => (
            <View key={`${entry.id}-${entry.familyId}`} style={{ paddingVertical: 8 }}>
              <ThemedText>{entry.label || entry.id}</ThemedText>
              <ThemedText style={{ opacity: 0.7 }}>
                {(entry.subjectDid || entry.id.replace(/^subject:/, '').split('|family:')[0])}
              </ThemedText>
              {entry.familyId ? <ThemedText style={{ opacity: 0.7 }}>{entry.familyId}</ThemedText> : null}
              <ThemedButton
                title={t('family.subjects.select', 'Use this subject')}
                onPress={() => handleSelect(entry)}
                style={{ marginTop: 8 }}
              />
            </View>
          ))
        )}
        {subjectDid ? (
          <ThemedText style={{ marginTop: 16, opacity: 0.8 }}>
            {t('family.subjects.active', 'Active subject')}: {subjectDid}
          </ThemedText>
        ) : null}
      </View>
    </ScrollView>
  );
}
