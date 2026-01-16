// screens/organization/communications/OrgAddConnectionScreen.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL

import React, { useMemo, useState } from 'react';
import { View, ScrollView, Alert, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { useAccessibilityContext } from '../../../context/AccessibilityContext';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { getScreenStyles } from '../../../constants/Styles';
import ThemedText from '../../../components/ThemedText';
import ThemedInput from '../../../components/ThemedTextInput';
import ThemedButton from '../../../components/ThemedButton';
import ThemedCheckbox from '../../../components/ThemedCheckbox';
import ConsentForm5 from '../../../components/ConsentForm5';

// stub simple de “directorio” para demo
const demoDirectory = [
  { id: 'svc-1', name: 'Patient Services', sector: 'healthcare' },
  { id: 'svc-2', name: 'Emergency Department', sector: 'healthcare' },
  { id: 'svc-3', name: 'Clinic Research Team', sector: 'healthcare' },
];

export default function OrgAddConnectionScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { accessibility } = useAccessibilityContext();
  const scale = accessibility.interfaceSize === 'S' ? 1 : accessibility.interfaceSize === 'L' ? 1.4 : 1.2;

  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const border = useThemeColor({}, 'border');

  const styles = useMemo(() => getScreenStyles(scale), [scale]);

  // estado local
  const [query, setQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [includeActivationConsent, setIncludeActivationConsent] = useState(false);
  const [preAuthorized, setPreAuthorized] = useState(false);
  const [termsDoc, setTermsDoc] = useState(null);

  const matches = useMemo(() => {
    if (!query) return demoDirectory;
    const q = query.toLowerCase();
    return demoDirectory.filter(s => s.name.toLowerCase().includes(q));
  }, [query]);

  const pickTerms = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf'],
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (res.canceled) return;
    const file = res.assets?.[0];
    setTermsDoc(file ? { name: file.name, uri: file.uri, mime: file.mimeType, size: file.size } : null);
  };

  const sendRequest = () => {
    // monta un payload sencillo de ejemplo
    const payload = {
      targetServiceId: selectedService?.id,
      targetServiceName: selectedService?.name,
      sector: selectedService?.sector,
      includeActivationConsent,
      preAuthorized,
      termsAttachment: termsDoc ? { name: termsDoc.name, uri: termsDoc.uri, mime: termsDoc.mime, size: termsDoc.size } : null,
      // Nota: ConsentForm5 gestiona reglas y registros.
      // Podrías leer su estado con un ref o un callback si lo expones.
    };

    if (!payload.targetServiceId) {
      Alert.alert('Validation', 'Select a service from the directory first.');
      return;
    }
    if (preAuthorized && !termsDoc) {
      Alert.alert('Validation', 'Attach signed Terms and Conditions for pre authorized requests.');
      return;
    }

    // aquí llamarías a tu backend
    console.log('Sending connection request:', payload);

    Alert.alert('Request sent', 'The connection request has been sent and is pending.');
    // puedes volver o navegar al listado
    navigation?.goBack?.();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bg }} contentContainerStyle={{ padding: 16 }}>
      <ThemedText variant="title">New Connection</ThemedText>
      <ThemedText style={{ color: text, marginBottom: 8 }}>
        Select a professional group or service from the directory. Optionally include the activation consent and attach signed Terms and Conditions.
      </ThemedText>

      {/* buscador de directorio */}
      <ThemedText>Search directory</ThemedText>
      <ThemedInput
        placeholder="Type a service name"
        value={query}
        onChangeText={setQuery}
      />

      <View style={{ borderWidth: 1, borderColor: border, borderRadius: 8, marginTop: 12 }}>
        {matches.map(svc => (
          <Pressable
            key={svc.id}
            onPress={() => setSelectedService(svc)}
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(127,127,127,0.2)',
              backgroundColor: selectedService?.id === svc.id ? 'rgba(100,100,255,0.1)' : 'transparent',
            }}
            accessibilityRole="button"
            accessibilityLabel={`Select ${svc.name}`}
          >
            <ThemedText style={{ fontWeight: '600' }}>{svc.name}</ThemedText>
            <ThemedText style={{ opacity: 0.7 }}>Sector: {svc.sector}</ThemedText>
          </Pressable>
        ))}
      </View>

      {/* opciones de solicitud */}
      <View style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <ThemedCheckbox checked={includeActivationConsent} onToggle={() => setIncludeActivationConsent(v => !v)} />
          <ThemedText style={{ marginLeft: 8 }}>Include activation consent</ThemedText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <ThemedCheckbox checked={preAuthorized} onToggle={() => setPreAuthorized(v => !v)} />
          <ThemedText style={{ marginLeft: 8 }}>
            Pre authorized request (attach signed Terms and Conditions)
          </ThemedText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <ThemedButton title={termsDoc ? 'Replace T&C PDF' : 'Attach T&C PDF'} onPress={pickTerms} />
          {termsDoc && <ThemedText numberOfLines={1} style={{ flex: 1 }}>{termsDoc.name}</ThemedText>}
        </View>
      </View>

      {/* ConsentForm reutilizado para reglas de acceso y permisos */}
      <View style={{ marginTop: 20 }}>
        <ThemedText variant="subtitle">Permissions and access rules</ThemedText>
        <ThemedText style={{ opacity: 0.8, marginBottom: 8 }}>
          Define which roles and sections are allowed for this connection.
        </ThemedText>
        <ConsentForm5 />
      </View>

      <View style={{ height: 16 }} />

      <ThemedButton title="Send request" onPress={sendRequest} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
