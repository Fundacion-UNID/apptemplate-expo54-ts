import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { getScreenStyles } from '../../../constants/Styles';
import ScreenHeader from '../../../components/ScreenHeader';
import ThemedText from '../../../components/ThemedText';
import { useContacts } from '../../../context/DirectoryContext';
import { ClaimsPersonSchemaorg } from '../../../constants/Schemas';

const OrgContactsScreen = () => {
  const { t } = useTranslation();
  const styles = getScreenStyles();
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  const { allContacts, isContactSystemReady } = useContacts();

  const renderContactItem = (contact) => {
    // Attempt to get email from indexed attributes (as it's prepared for search)
    const email = contact.indexed?.find(attr => attr.name === ClaimsPersonSchemaorg.email)?.value || 'No email';
    
    // Attempt to get name from the encrypted content
    const name = contact.content?.[ClaimsPersonSchemaorg.givenName] 
      ? `${contact.content[ClaimsPersonSchemaorg.givenName]} ${contact.content[ClaimsPersonSchemaorg.familyName]}`
      : 'Unknown Name';

    return (
      <View key={contact.id} style={{ padding: 15, borderBottomWidth: 1, borderColor }}>
        <ThemedText style={{ fontWeight: 'bold' }}>{name}</ThemedText>
        <ThemedText style={{ color: 'gray', fontSize: 12, marginTop: 4 }}>{contact.id}</ThemedText>
        <ThemedText style={{ marginTop: 8 }}>{email}</ThemedText>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor }}>
      <ScreenHeader 
        title={t('organization.screens.contacts.title')} 
        subtitle={t('organization.screens.contacts.subtitle')} 
      />
      <View style={styles.container}>
        {isContactSystemReady && allContacts.length > 0 ? (
          allContacts.map(renderContactItem)
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ThemedText>{t('organization.screens.contacts.noRecentContacts')}</ThemedText>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OrgContactsScreen;
