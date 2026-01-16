// screens/organization/OrgIssueCredentialScreen
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import { ScrollView, View } from 'react-native';
import { useState } from 'react';
import { ScreenHeader } from '../../components/ScreenHeader';
import ThemedTextInput from '../../components/ThemedTextInput';
import ThemedCheckbox from '../../components/ThemedCheckbox';
import ThemedButton from '../../components/ThemedButton';
import { useTranslation } from 'react-i18next';

export default function OrgIssueCredentialScreen() {
    const { t } = useTranslation();
    const [uuid, setUuid] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [twinsNumber, setTwinsNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [notifySelf, setNotifySelf] = useState(true);

    return (
        <ScrollView>
            <ScreenHeader title={t('org.issueCredential.title')} subtitle={t('org.issueCredential.subtitle')} />
            <View style={{ padding: 16 }}>
                <ThemedTextInput placeholder="UUID (or generate)" value={uuid} onChangeText={setUuid} />
                <ThemedTextInput placeholder="Birth Date (YYYY-MM-DD)" value={birthDate} onChangeText={setBirthDate} />
                <ThemedTextInput placeholder="Twins Number (0 if none)" keyboardType="numeric" value={twinsNumber} onChangeText={setTwinsNumber} />
                <ThemedTextInput placeholder="Full Official Name (transliterated)" value={fullName} onChangeText={setFullName} />
                <ThemedCheckbox label="Notify Individual by Email" checked={notifySelf} onPress={() => setNotifySelf(!notifySelf)} />
                <ThemedButton title={t('buttons.issue')} onPress={() => {/* handle issuing logic */}} />
            </View>
        </ScrollView>
    );
}
