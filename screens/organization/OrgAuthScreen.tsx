// screens/organization/OrgAuthScreen.tsx
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAccessibilityContext } from '../../context/AccessibilityContext';
import AccessibleButtonGrid, { ButtonItem } from '../../components/AccessibleButtonGrid';
import ScreenHeader from '../../components/ScreenHeader';
import { getScreenStyles } from '../../constants/Styles';
import { Routes } from '../../constants/Routes';
import { useThemeColor } from '../../hooks/useThemeColor';

// Define a basic type for the navigation prop for this screen.
// For a more robust solution, a centralized navigation type definition would be ideal.
type OrgAuthScreenNavigationProp = {
  navigate: (routeName: string) => void;
};

// Define the type for the component's props.
type OrgAuthScreenProps = {
  navigation: OrgAuthScreenNavigationProp;
};


const OrgAuthScreen: React.FC<OrgAuthScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const { scaleFactor } = useAccessibilityContext();
    const backgroundColor = useThemeColor({}, 'background');
    const styles = getScreenStyles(scaleFactor);

    // Define auth buttons with the AuthButton type.
    const buttons: ButtonItem[] = [
        {
            id: Routes.Organization.LoginAuth.name,
            iconName: 'login',
            iconType: 'material',
            label: t('auth.login'),
            route: Routes.Organization.LoginAuth.name,
        },
        {
            id: Routes.Organization.RegisterAuth.name,
            iconName: 'person-add',
            iconType: 'material',
            label: t('auth.register'),
            route: Routes.Organization.RegisterAuth.name,
        },
    ];

    const handlePress = (item: ButtonItem) => {
        navigation.navigate(item.route);
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor }}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
        >
            <ScreenHeader
                title={t('organization.screens.auth.title')}
                subtitle={t('organization.screens.auth.subtitle')}
                description={t('organization.screens.auth.description')}
            />

            <AccessibleButtonGrid data={buttons} onPress={handlePress} />
        </ScrollView>
    );
};

export default OrgAuthScreen;
