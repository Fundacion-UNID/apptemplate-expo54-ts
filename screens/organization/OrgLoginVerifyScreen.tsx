// screens/organization/OrgLoginVerifyScreen.js
import React from 'react';
import { View } from 'react-native';
import { getScreenStyles } from '../../constants/Styles';
import { useThemeColor } from '../../hooks/useThemeColor';
import LoginVerify from '../../components/LoginVerify'; // Import the new component

export default function OrgLoginVerifyScreen({ route, navigation }) {
    const styles = getScreenStyles();
    const backgroundColor = useThemeColor({}, 'background');
    const { requiresUnlock } = route.params;

    const handleSuccess = (jwtPayload) => {
        // The profile context has already been updated by the LoginProfile component.
        // We just need to navigate to the main part of the app.
        console.log('[Login Flow] Verification successful. Navigating to dashboard.');
        navigation.navigate('OrgDashboard');
    };

    return (
        <View style={[styles.container, { backgroundColor, justifyContent: 'flex-start' }]}>
            <LoginVerify 
                requiresUnlock={requiresUnlock}
                onSuccess={handleSuccess}
            />
        </View>
    );
}
