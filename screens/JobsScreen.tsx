// screens/JobsScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Vault from '../storage/Vault';
import { useJobs } from '../context/JobContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { getScreenStyles } from '../constants/Styles';
import ThemedText from '../components/ThemedText';
import ThemedButton from '../components/ThemedButton';
import ScreenHeader from '../components/ScreenHeader';
import { useTranslation } from 'react-i18next';
import i18n from '../utils/i18n'; // Import i18n instance for debugging

const JobsScreen = () => {
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { t } = useTranslation('appCommon');
  const { unprotectJob, isJobSystemReady } = useJobs(); // Get the secure unprotect function

  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  // Theme Colors
  const bgColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const errorColor = useThemeColor({}, 'error');
  const pendingColor = useThemeColor({ light: 'orange', dark: 'yellow' }, 'text');
  const emptyTextColor = useThemeColor({ light: '#888', dark: '#aaa' }, 'text');

  // Data Loading and Decryption
  const fetchAndPrepareJobs = useCallback(async () => {
    if (!isJobSystemReady) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const allJobsFromVault = await Vault.getAllJobs();
      const preparedJobs = await Promise.all(
        allJobsFromVault.map(async (job) => {
          try {
            // Attempt to decrypt to get more details and confirm integrity
            await unprotectJob(job);
            return {
              ...job,
              isCorrupt: false,
            };
          } catch (e) {
            console.warn(`[JobsScreen] Failed to decrypt job ${job.id}. Marking as corrupt.`, e);
            return {
              ...job,
              isCorrupt: true,
            };
          }
        })
      );
      setJobs(preparedJobs);
    } catch (error) {
      console.error("[JobsScreen] Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [isJobSystemReady, unprotectJob]);

  // useFocusEffect will re-fetch jobs every time the screen comes into view
  useFocusEffect(
    useCallback(() => {
      fetchAndPrepareJobs();
    }, [fetchAndPrepareJobs])
  );

  // Action Handlers
  const handleDelete = async (jobId) => {
    try {
      await Vault.deleteJob(jobId);
      fetchAndPrepareJobs(); // Refresh the list
    } catch (error) {
      console.error(`Failed to delete job ${jobId}:`, error);
    }
  };

  const handleMoveToDrafts = async (jobId) => {
    try {
      await Vault.updateJobStatus(jobId, 'draft');
      fetchAndPrepareJobs(); // Refresh the list
    } catch (error) {
      console.error(`Failed to move job ${jobId} to drafts:`, error);
    }
  };
  
  // UI Components
  const ActionButtons = ({ job }) => (
    <View style={localStyles.actionContainer}>
      {!job.isCorrupt && (job.status === 'error' || job.status === 'pending') && (
        <ThemedButton
          title={t('jobs.moveToDraft')}
          onPress={() => handleMoveToDrafts(job.id)}
          type="outline"
          buttonStyle={localStyles.actionButton}
          titleStyle={localStyles.actionButtonTitle}
        />
      )}
      <ThemedButton
        title={t('delete')}
        onPress={() => handleDelete(job.id)}
        type="outline"
        buttonStyle={[localStyles.actionButton, { borderColor: errorColor }]}
        titleStyle={[localStyles.actionButtonTitle, { color: errorColor }]}
      />
    </View>
  );

  const JobItem = ({ job }) => {
    const status = job.isCorrupt ? 'corrupt' : job.status || 'unknown';
    const statusColor = status === 'corrupt' || status.includes('error') ? errorColor : pendingColor;
    const jobId = job.id || 'unknown-id';

    return (
      <View style={[styles.modalJobItem, { borderBottomColor: borderColor }]}>
        {/* Container for the textual info (Status + ID) */}
        <View style={styles.jobInfoContainer}>
          <ThemedText style={[styles.modalJobStatus, { color: statusColor }]}>
            {t('jobs.status', { status })}
          </ThemedText>
          <ThemedText style={styles.modalJobId} selectable>
            {t('jobs.jobId', { id: jobId })}
          </ThemedText>
        </View>

        {/* Container for the buttons */}
        <View style={styles.jobActionsContainer}>
          <ActionButtons job={job} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        title={t('jobs.title')}
        subtitle={t('jobs.subtitle')}
      />
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {jobs.length > 0 ? (
            jobs.map(job => <JobItem key={job.id} job={job} />)
          ) : (
            <ThemedText style={[styles.modalEmptyText, { color: emptyTextColor }]}>
              {t('jobs.noJobsFound')}
            </ThemedText>
          )}
        </>
      )}
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    actionButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginHorizontal: 4,
    },
    actionButtonTitle: {
        fontSize: 12,
    }
});

export default JobsScreen;