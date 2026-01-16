// components/LoginProfile.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../context/ProfileContext';
import ScreenHeader from './ScreenHeader';
import ThemedInput from './ThemedTextInput';
import ThemedButton from './ThemedButton';
import ThemedText from './ThemedText';

// Mock Wallet/API for demonstration. In a real app, this would be a real service.
const Wallet = {
  unlockProfile: async (profile, pin) => {
    console.log(`[Wallet Mock] "Unlocking" profile ${profile.id} with PIN.`);
    // TODO: Implement real JWE decryption of the profile's seed/keys.
    // For now, we just parse the unprotectedData.
    const unprotectedData = typeof profile._unprotectedData === 'string' 
      ? JSON.parse(profile._unprotectedData) 
      : profile._unprotectedData;
    console.log('[Wallet Mock] Profile content "decrypted".');
    return { ...profile, unprotectedData };
  },
  prepareVerificationRequest: async (profile, verificationCode) => {
    console.log(`[Wallet Mock] Preparing secure request for DID ${profile.did}`);
    // TODO: This is where the full DIDComm JWS/JWE logic will go.
    // 1. Create a JWS: Sign a payload containing the verification code and other assertions
    //    using the private key from the unlocked wallet.
    // 2. The JWS protected header will include the public key as a 'jwk'. This is how
    //    the provider registers the device's key to the did:web.
    // 3. Create a JWE: Encrypt the JWS for the provider's DID. The JWE header will also
    //    contain the sender's public key ('jwk') for authenticated encryption.
    const mockSecureRequest = {
      protected: 'header-jwe',
      encrypted_key: 'key',
      iv: 'iv',
      ciphertext: 'jws-goes-here',
      tag: 'tag',
    };
    console.log('[Wallet Mock] JWE/JWS request created.');
    return mockSecureRequest;
  }
};

const Api = {
  verifyCode: async (secureRequest) => {
    console.log('[API Mock] Sending secure request to provider.');
    // In a real scenario, this would be a fetch call to the provider's endpoint.
    // The server would decrypt, verify the signature, and return a session token if the code is valid.
    return new Promise(resolve => setTimeout(() => resolve({
      valid: true,
      payload: { sub: 'mock-user-id', iss: 'mock-issuer' } 
    }), 1000));
  }
};

export default function LoginVerify({ onSuccess, requiresUnlock }) {
    const { t } = useTranslation();
    const { profile, setProfile } = useProfile();

    const [isUnlocked, setIsUnlocked] = useState(!requiresUnlock);
    const [pin, setPin] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUnlock = async () => {
        if (!profile) return;
        setIsLoading(true);
        setError('');
        try {
            const unlockedProfile = await Wallet.unlockProfile(profile, pin);
            setProfile(unlockedProfile); // Update the global context with the "decrypted" profile
            setIsUnlocked(true);
        } catch (e) {
            setError(t('unlockFailed'));
            console.error(e);
        }
        setIsLoading(false);
    };

    const handleVerify = async () => {
        if (!profile) return;
        setIsLoading(true);
        setError('');
        try {
            const secureRequest = await Wallet.prepareVerificationRequest(profile, verificationCode);
            const result = await Api.verifyCode(secureRequest) as { valid: boolean; payload: any };
            if (result.valid) {
                onSuccess(result.payload);
            } else {
                setError(t('invalidCode'));
            }
        } catch (e) {
            setError(t('verificationFailed'));
            console.error(e);
        }
        setIsLoading(false);
    };

    if (!isUnlocked) {
        return (
            <>
                <ScreenHeader
                    title={t('organization.screens.loginVerify.unlockTitle')}
                    subtitle={t('organization.screens.loginVerify.unlockSubtitle')}
                />
                <View style={{ padding: 16 }}>
                    <ThemedInput
                        placeholder={t('common.forms.pinPlaceholder')}
                        value={pin}
                        onChangeText={setPin}
                        secureTextEntry
                        keyboardType="number-pad"
                    />
                    <ThemedButton
                        title={t('organization.screens.loginVerify.unlockButton')}
                        onPress={handleUnlock}
                        disabled={!pin || isLoading}
                        loading={isLoading}
                        style={{ marginTop: 16 }}
                    />
                </View>
            </>
        );
    }

    return (
        <>
            <ScreenHeader
                title={t('organization.screens.loginVerify.verifyTitle')}
                subtitle={t('organization.screens.loginVerify.verifySubtitle')}
            />
            <View style={{ padding: 16 }}>
                <ThemedInput
                    placeholder={t('input-code-placeholder')}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                />
                <ThemedButton
                    title={t('verifyCode')}
                    onPress={handleVerify}
                    disabled={!verificationCode || isLoading}
                    loading={isLoading}
                    style={{ marginTop: 16 }}
                />
                 {error ? <ThemedText style={{color: 'red', textAlign: 'center', marginTop: 10}}>{error}</ThemedText> : null}
            </View>
        </>
    );
}
