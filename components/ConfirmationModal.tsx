// components/ConfirmationModal.tsx
import React from 'react';
import { Modal, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ThemedText from './ThemedText';
import ThemedButton from './ThemedButton';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { getModalStyles } from '../constants/Styles';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}: ConfirmationModalProps) {
  const { t } = useTranslation();
  const { scaleFactor } = useAccessibilityContext();
  const styles = getModalStyles(scaleFactor);
  const cardColor = useThemeColor({}, 'card');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <ThemedText style={styles.modalMessage}>{message}</ThemedText>
          <View style={styles.buttonContainer}>
            <ThemedButton
              title={cancelText || t('common.cancel')}
              onPress={onCancel}
              type="secondary"
              style={styles.button}
              accessible
              accessibilityRole="button"
              accessibilityLabel={cancelText || t('common.cancel')}
            />
            <ThemedButton
              title={confirmText || t('common.confirm')}
              onPress={onConfirm}
              type="primary"
              style={styles.button}
              accessible
              accessibilityRole="button"
              accessibilityLabel={confirmText || t('common.confirm')}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
