// App.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

// This line ensures Firebase is initialized before any other part of the app.
import './utils/firebase-config';

// See docs/context-providers.md for a detailed explanation of the provider stack.
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import RootNavigator from './navigation/RootNavigator';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AppTypeProvider } from './context/AppTypeContext';
import { ProfileProvider } from './context/ProfileContext';
import { SubjectProvider } from './context/SubjectContext';
import { JobProvider } from './context/JobContext';
import { DirectoryProvider } from './context/DirectoryContext';
import { AuthorizationProvider } from './context/AuthorizationContext';
import { EntitlementProvider } from './context/EntitlementContext';

export default function App() {
    return (
        <AccessibilityProvider>
            <AppTypeProvider>
                <ProfileProvider>
                    <AuthorizationProvider>
                        <DirectoryProvider>
                            <JobProvider>
                                <SubjectProvider>
                                    <I18nextProvider i18n={i18n}>
                                        <EntitlementProvider>
                                            <RootNavigator />
                                        </EntitlementProvider>
                                    </I18nextProvider>
                                </SubjectProvider>
                            </JobProvider>
                        </DirectoryProvider>
                    </AuthorizationProvider>
                </ProfileProvider>
            </AppTypeProvider>
        </AccessibilityProvider>
    );
}
