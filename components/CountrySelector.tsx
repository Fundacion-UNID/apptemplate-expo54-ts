// components/CountrySelector.js

import React, { useMemo, useState, useEffect } from 'react';
import {
  Platform,
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CountryPicker } from 'react-native-country-codes-picker';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { moderateScale, scale } from 'react-native-size-matters';

// Native flags
import CountryFlag from 'react-native-country-flag';

/**
 * Web-only flag component using country-flag-icons (React DOM)
 * Only import the generic helper to avoid bundling every SVG.
 * We will dynamically pick the right class name for the flag.
 */
let WebFlag = null;
if (Platform.OS === 'web') {
  // country-flag-icons exposes CSS classes and prebuilt React components per flag.
  // The simplest cross-setup solution is to use the CSS class approach.
  // Add this once in your app root (e.g., index.html) to load the stylesheet:
  // <link rel="stylesheet" href="https://unpkg.com/country-flag-icons/3x2/flags.css" />
  WebFlag = ({ code, size = 18 }) => {
    const cls = `flag:${code?.toUpperCase?.() || ''}`;
    return (
      <span
        className={cls}
        style={{
          display: 'inline-block',
          width: size * 1.6,
          height: size,
          backgroundSize: 'cover',
          borderRadius: 2,
          verticalAlign: 'middle',
          marginRight: 8,
        }}
      />
    );
  };
}

/**
 * Minimal props to mirror your earlier usage
 * value: ISO 3166-1 alpha-2 code, uppercase like 'ES'
 * onChange: function(code: string)
 */
type CountrySelectorProps = {
  value?: string;
  onChange: (code: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowedCountries?: string[];
};

export default function CountrySelector({
  value,
  onChange,
  placeholder = '-- Select Country --',
  disabled = false,
  allowedCountries,
}: CountrySelectorProps) {
  const { scaleFactor } = useAccessibilityContext();
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const [visible, setVisible] = useState(false);
  const [countryName, setCountryName] = useState('');

  const code = useMemo(
    () => (value ? String(value).toUpperCase() : ''),
    [value]
  );

  // Effect to handle initial value or reset
  useEffect(() => {
    if (!code) {
      setCountryName('');
    }
    // Note: We can't get the name from the code here without a full country list.
    // The name is set upon selection from the picker.
    // If an initial `value` is provided, it will show the code until a new country is picked.
  }, [code]);

  const handleSelect = (item) => {
    const pickedCode = String(item?.cca2 || item?.code || '').toUpperCase();
    // The picker returns the name in the selected language.
    const pickedName = item?.name?.common || item?.name || pickedCode;
    onChange(pickedCode);
    setCountryName(pickedName);
    setVisible(false);
  };

  const fieldStyle: ViewStyle = {
    borderColor: tintColor,
    borderWidth: 1,
    borderRadius: scale(8),
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    marginBottom: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    opacity: disabled ? 0.6 : 1,
  };

  const textStyle: TextStyle = {
    fontSize: moderateScale(14 * scaleFactor),
    color: textColor,
  };

  const allowedSet = useMemo(
    () => (allowedCountries ? new Set(allowedCountries.map((entry) => entry.toUpperCase())) : null),
    [allowedCountries]
  );

  const webCountries = useMemo(
    () => [
      { code: 'CA', label: 'Canada' },
      { code: 'US', label: 'United States' },
      { code: 'MX', label: 'México' },
      { code: 'GB', label: 'United Kingdom' },
      { code: 'ES', label: 'España' },
      { code: 'FR', label: 'France' },
      { code: 'DE', label: 'Deutschland' },
    ],
    []
  );

  const filteredWebCountries = useMemo(() => {
    if (!allowedSet) return webCountries;
    return webCountries.filter((country) => allowedSet.has(country.code));
  }, [allowedSet, webCountries]);

  const pickerCountryCodes = useMemo(() => {
    if (!allowedSet) return undefined;
    return Array.from(allowedSet);
  }, [allowedSet]);

  // WEB: simple stable dropdown, optional web flag
  if (Platform.OS === 'web') {
    return (
      <View style={fieldStyle}>
        {code ? (
          WebFlag ? (
            <WebFlag code={code} />
          ) : null
        ) : null}
        <Picker
          selectedValue={code}
          onValueChange={(c) => onChange(String(c))}
          dropdownIconColor={textColor}
          style={[styles.picker, textStyle]}
          enabled={!disabled}
        >
          <Picker.Item label={placeholder} value="" />
          {filteredWebCountries.map((country) => (
            <Picker.Item key={country.code} label={country.label} value={country.code} />
          ))}
        </Picker>
      </View>
    );
  }

  // NATIVE: use the searchable modal from react-native-country-codes-picker
  return (
    <View>
      <Pressable style={fieldStyle} onPress={() => !disabled && setVisible(true)} disabled={disabled}>
        {code ? (
          <CountryFlag isoCode={code} size={18} style={{ marginRight: 8 }} />
        ) : (
          // Spacer to keep placeholder aligned with selected value
          <View style={{ width: 18 + 8 }} />
        )}
        <Text style={textStyle}>
          {countryName || code || placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
        transparent
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <CountryPicker
              show
              countryCodes={pickerCountryCodes}
              style={{
                modal: { height: 420 },
                textInput: { height: 42, fontSize: 16 },
                countryName: { fontSize: 16 },
                dialCode: { fontSize: 16 },
              }}
              pickerButtonOnPress={handleSelect}
              lang="en"
              inputPlaceholder="Search country"
            />
            <Pressable style={styles.closeBtn} onPress={() => setVisible(false)}>
              <Text style={styles.closeTxt}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: { flex: 1, height: 28, borderWidth: 0, backgroundColor: 'transparent' }, // Adjusted for consistency
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e1e1e1',
  },
  closeTxt: { fontSize: 16, fontWeight: '600' },
});
