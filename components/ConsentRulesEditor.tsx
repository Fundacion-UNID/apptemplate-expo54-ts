// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.
// File: components/ConsentRulesEditor.tsx

import React, { useState } from 'react';
import { View, Modal, StyleSheet, FlatList, Alert } from 'react-native';
import { ClaimsConsent, ClaimsContextFhirConsent } from 'gdc-sdk-client-ts';
import ThemedButton from './ThemedButton';
import ThemedText from './ThemedText';
import ThemedTextInput from './ThemedTextInput';

/**
 * @file This component provides a full UI for creating, editing, and deleting a list of consent rules.
 * @purpose It's designed for screens where a professional digitizes a paper consent form or a user
 * defines their data sharing preferences. It manages a list of `ClaimsConsent` objects.
 */

interface ConsentRulesEditorProps {
  subjectDid: string;
  initialRules?: Partial<ClaimsConsent>[];
  onSave: (rules: ClaimsConsent[]) => void;
  onCancel: () => void;
}

// Define props for the placeholder Picker to ensure type safety.
interface ThemedPickerProps {
  selectedValue: any;
  onValueChange: (value: any) => void;
  children?: React.ReactNode;
}

// Placeholder for a ThemedPicker. In a real app, this would be a styled component from a library.
const ThemedPicker: React.FC<ThemedPickerProps> = ({ selectedValue, onValueChange, children }) => (
  <View style={styles.picker}>
    {/* In a real app, this would be a @react-native-picker/picker or a custom dropdown */}
    <ThemedText>Picker Placeholder: {selectedValue}</ThemedText>
    {/* The onValueChange would be triggered by the real picker's events */}
  </View>
);

export const ConsentRulesEditor: React.FC<ConsentRulesEditorProps> = ({
  subjectDid,
  initialRules = [],
  onSave,
  onCancel,
}) => {
  const [rules, setRules] = useState<Partial<ClaimsConsent>[]>(initialRules);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRule, setCurrentRule] = useState<Partial<ClaimsConsent>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddNewRule = () => {
    setCurrentRule({
      [ClaimsContextFhirConsent.Subject]: subjectDid,
      [ClaimsContextFhirConsent.Decision]: 'permit', // Default value
      [ClaimsContextFhirConsent.Status]: 'active', // Default value
      [ClaimsContextFhirConsent.Category]: 'LOINC|64292-6', // Default value
    });
    setEditingIndex(null);
    setModalVisible(true);
  };

  const handleEditRule = (rule: Partial<ClaimsConsent>, index: number) => {
    setCurrentRule(rule);
    setEditingIndex(index);
    setModalVisible(true);
  };

  const handleDeleteRule = (index: number) => {
    Alert.alert('Delete Rule', 'Are you sure you want to delete this rule?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedRules = [...rules];
          updatedRules.splice(index, 1);
          setRules(updatedRules);
        },
      },
    ]);
  };

  const handleSaveRule = () => {
    // --- Validation ---
    if (!currentRule[ClaimsContextFhirConsent.Decision] || !currentRule[ClaimsContextFhirConsent.Purpose]) {
      Alert.alert('Validation Error', 'Decision and Purpose are required fields.');
      return;
    }

    let updatedRules = [...rules];
    if (editingIndex !== null) {
      // Update existing rule
      updatedRules[editingIndex] = currentRule;
    } else {
      // Add new rule
      updatedRules.push(currentRule);
    }
    setRules(updatedRules);
    setModalVisible(false);
    setEditingIndex(null);
    setCurrentRule({});
  };

  const handleSubmit = () => {
    // Final validation to ensure all rules are complete before saving.
    if (rules.some(rule => !rule[ClaimsContextFhirConsent.Decision] || !rule[ClaimsContextFhirConsent.Subject])) {
      Alert.alert('Error', 'Some rules are incomplete. Please review them before saving.');
      return;
    }
    onSave(rules as ClaimsConsent[]);
  };

  const renderRule = ({ item, index }: { item: Partial<ClaimsConsent>; index: number }) => (
    <View style={styles.ruleItem}>
      <ThemedText style={styles.ruleText}>
        {`Rule ${index + 1}: ${item[ClaimsContextFhirConsent.Decision]?.toUpperCase()} access for ${item[ClaimsContextFhirConsent.Purpose] || 'N/A'}`}
      </ThemedText>
      <View style={styles.ruleButtons}>
        <ThemedButton onPress={() => handleEditRule(item, index)} accessibilityLabel={`Edit rule ${index + 1}`} title="Edit" />
        <ThemedButton onPress={() => handleDeleteRule(index)} accessibilityLabel={`Delete rule ${index + 1}`} title="Delete" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText variant="title" style={styles.header}>Consent Rules Editor</ThemedText>
      
      <FlatList
        data={rules}
        renderItem={renderRule}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<ThemedText>No rules defined. Add one to get started.</ThemedText>}
      />

      <ThemedButton
        onPress={handleAddNewRule}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Add a new consent rule"
        style={styles.mainButton}
        title="Add New Rule"
      />

      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ThemedText variant="title">{editingIndex !== null ? 'Edit Rule' : 'Add New Rule'}</ThemedText>
          
          <ThemedPicker
            selectedValue={currentRule[ClaimsContextFhirConsent.Decision] || 'permit'}
            onValueChange={(value) => setCurrentRule(prev => ({ ...prev, [ClaimsContextFhirConsent.Decision]: value }))}
          >
            {/* These would be Picker.Item in a real component */}
          </ThemedPicker>

          <ThemedTextInput
            label="Purpose of Use (e.g., ETREAT, COC)"
            value={currentRule[ClaimsContextFhirConsent.Purpose] || ''}
            onChangeText={(text: string) => setCurrentRule(prev => ({ ...prev, [ClaimsContextFhirConsent.Purpose]: text }))}
            placeholder="ETREAT"
            style={{}}
          />

          {/* ... Add other ThemedTextInput and ThemedPicker for all fields in ClaimsConsent ... */}
          {/* Example for ActorReference */}
          <ThemedTextInput
            label="Actor Reference (Scope)"
            value={currentRule[ClaimsContextFhirConsent.ActorReference] || ''}
            onChangeText={(text: string) => setCurrentRule(prev => ({ ...prev, [ClaimsContextFhirConsent.ActorReference]: text }))}
            placeholder="urn:iso:3166|ES"
            style={{}}
          />

          <View style={styles.modalButtons}>
            <ThemedButton onPress={handleSaveRule} accessibilityLabel="Save this rule" title="Save Rule" />
            <ThemedButton onPress={() => setModalVisible(false)} accessibilityLabel="Cancel editing" title="Cancel" />
          </View>
        </View>
      </Modal>

      <View style={styles.footerButtons}>
        <ThemedButton onPress={handleSubmit} accessibilityLabel="Save all consent changes" title="Save & Finalize" />
        <ThemedButton onPress={onCancel} accessibilityLabel="Discard all changes" title="Cancel" />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 16 },
  mainButton: { marginTop: 16 },
  ruleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  ruleText: { flex: 1 },
  ruleButtons: { flexDirection: 'row' },
  modalContainer: { flex: 1, padding: 20, paddingTop: 50 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  footerButtons: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 10, marginTop: 10 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginVertical: 8 },
});
