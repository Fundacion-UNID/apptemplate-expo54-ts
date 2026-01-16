// components/JobsStatusModal.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Pressable, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import * as Vault from '../storage/Vault';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { getScreenStyles } from '../constants/Styles';
import ThemedText from './ThemedText';
import ThemedButton from './ThemedButton';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';

// The modal now needs a wallet instance to try to decrypt jobs
const JobsStatusModal = ({ isVisible, onClose, wallet }) => {
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  // Theme Colors
  const modalBgColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const errorColor = useThemeColor({}, 'error');
  const pendingColor = useThemeColor({ light: 'orange', dark: 'yellow' }, 'text');
  const emptyTextColor = useThemeColor({ light: '#888', dark: '#aaa' }, 'text');

  // Data Loading and Decryption
  const fetchAndPrepareJobs = useCallback(async () => {
    if (!wallet) return; // Do nothing if the wallet is not ready

    setIsLoading(true);
    try {
      const allJobsFromVault = await Vault.getAllJobs();
      const preparedJobs = await Promise.all(
        allJobsFromVault.map(async (job) => {
          try {
            // Attempt to decrypt to get more details like the 'thid'
            const unprotected = await wallet.unprotectConfidentialData(job);
            return {
              ...job, // Keep original data like id, status, jwe
              thid: unprotected.content?.thid || '(decryption ok)',
              isCorrupt: false,
            };
          } catch (e) {
            console.warn(`[JobsStatusModal Failed to decrypt job ${job.id}. Marking as corrupt.`, e);
            // If decryption fails, mark it as corrupt but still display it
            return {
              ...job,
              thid: '(decryption failed)',
              isCorrupt: true,
            };
          }
        })
      );
      setJobs(preparedJobs);
    } catch (error) {
      console.error("[JobsStatusModal] Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    if (isVisible) {
      fetchAndPrepareJobs();
    }
  }, [isVisible, fetchAndPrepareJobs]);

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
    // This is only possible for non-corrupt jobs
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
          title={t('components.jobsStatusModal.moveToDraft')}
          onPress={() => handleMoveToDrafts(job.id)}
          type="outline"
          buttonStyle={localStyles.actionButton}
          titleStyle={localStyles.actionButtonTitle}
        />
      )}
      {/* Deleting is always possible */}
      <ThemedButton
        title={t('common.delete')}
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
    const truncatedId = job.id?.substring(0, 13) || '...';

    return (
      <View style={[styles.modalJobItem, { borderBottomColor: borderColor }]}>
        <View>
            <ThemedText style={styles.modalJobId} numberOfLines={1}>
              {t('components.jobsStatusModal.jobId', { id: truncatedId + '...' })}
            </ThemedText>
            <ThemedText style={[styles.modalJobStatus, { color: statusColor }]}>
              {t('components.jobsStatusModal.status', { status })}
            </ThemedText>
        </View>
        <ActionButtons job={job} />
      </View>
    );
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={[styles.modalContainer, { backgroundColor: modalBgColor }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.title}>{t('components.jobsStatusModal.title')}</ThemedText>
            <Pressable onPress={onClose}><Icon name="close" color={textColor} /></Pressable>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <ScrollView>
              {jobs.length > 0 ? (
                jobs.map(job => <JobItem key={job.id} job={job} />)
              ) : (
                <ThemedText style={[styles.modalEmptyText, { color: emptyTextColor }]}>
                  {t('components.jobsStatusModal.noJobsFound')}
                </ThemedText>
              )}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
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

export default JobsStatusModal;