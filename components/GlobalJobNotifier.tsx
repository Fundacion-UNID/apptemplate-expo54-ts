// components/GlobalJobNotifier.js
import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useJobs } from '../context/JobContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { getScreenStyles } from '../constants/Styles';
import ThemedText from './ThemedText';
import ThemedButton from './ThemedButton';
import { JobStatus } from 'gdc-common-utils-ts/models/confidential-job';

const GlobalJobNotifier = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation('appCommon');
  // The useJobs hook now returns an object with the manager and a loading state.
  const { jobs, isLoading } = useJobs();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getScreenStyles(scaleFactor);
  const backgroundColor = useThemeColor({}, 'background');

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // If the manager is still being set up, a notification is already shown,
    // or the manager is null (e.g., after logout), do nothing.
    if (isLoading || notification) return;

    const checkForCompletedJobs = async () => {
      const newCompletedJob = jobs.find(job => {
        const jobAny = job as any;
        return job?.status === JobStatus.COMPLETED && !jobAny.acknowledged;
      });

      const notificationInfo = (newCompletedJob as any)?.notification;
      if (newCompletedJob && notificationInfo) {
        setNotification({
          title: notificationInfo.title || t('notifications.jobComplete.title'),
          message: notificationInfo.message || t('notifications.jobComplete.message'),
          navigateTo: notificationInfo.navigateTo,
          jobId: newCompletedJob.id,
        });
      }
    };

    checkForCompletedJobs();
  }, [jobs, isLoading, t, notification]);

  const handleAction = (shouldNavigate) => {
    if (!notification) return;
    
    if (shouldNavigate) {
      navigation.navigate(notification.navigateTo);
    }
    setNotification(null);
  };

  if (!notification) {
    return null;
  }

  return (
    <Modal visible={true} transparent animationType="fade" onRequestClose={() => handleAction(false)}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor, padding: 20, borderRadius: 10, width: '85%' }}>
          <ThemedText style={styles.title} accessible accessibilityRole="header">
            {notification.title}
          </ThemedText>
          <ThemedText>{notification.message}</ThemedText>
          
          <View style={{ marginTop: 20 }}>
            <ThemedButton
              title={t('notifications.jobComplete.viewButton')}
              onPress={() => handleAction(true)}
              accessible
              accessibilityLabel={t('notifications.jobComplete.viewButton')}
              accessibilityRole="button"
            />
            <Pressable onPress={() => handleAction(false)} style={{ marginTop: 10, alignItems: 'center' }}>
              <ThemedText>{t('notifications.jobComplete.dismissButton')}</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GlobalJobNotifier;
