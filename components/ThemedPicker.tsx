// components/ThemedPicker.tsx
import React from 'react';
import { View, Platform, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Picker, PickerProps } from '@react-native-picker/picker';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { moderateScale, scale } from 'react-native-size-matters';

// --- Type Definitions ---

interface PickerItem {
  label: string;
  value: any;
}

// Define the props for our custom component. We do not extend PickerProps
// to avoid style conflicts. Instead, we accept PickerProps via `...props`.
interface ThemedPickerProps {
  selectedValue: any;
  onValueChange: (itemValue: any, itemIndex: number) => void;
  items: PickerItem[];
  enabled?: boolean;
  disabled?: boolean;
  placeholder?: string;
  style?: StyleProp<ViewStyle>; // The style for the wrapping View on Android
  iosPickerStyle?: StyleProp<TextStyle>; // Specific style for the iOS Picker itself
  accessibilityLabel?: string;
  props?: PickerProps;
}

const ThemedPicker: React.FC<ThemedPickerProps> = ({
  selectedValue,
  onValueChange,
  items = [],
  placeholder,
  style,
  iosPickerStyle,
  enabled = true,
  disabled = false,
  ...props
}) => {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'inputBackground');
  const baseBorderColor = useThemeColor({}, 'inputBorder');
  const activeBorderColor = useThemeColor({}, 'tint');
  const { accessibility, scaleFactor } = useAccessibilityContext();
  const fontSize = moderateScale(14 * scaleFactor);
  const hasSelection = selectedValue !== undefined && selectedValue !== null && selectedValue !== '';
  const borderColor = hasSelection ? activeBorderColor : baseBorderColor;

  if (Platform.OS === 'android') {
    const pickerTextColor = textColor;
    return (
      <View style={[ { borderColor, borderWidth: 1, borderRadius: scale(8), marginBottom: scale(12), backgroundColor }, style ]}>
        <Picker
          key={accessibility.colorTheme}
          enabled={enabled && !disabled}
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={{ color: pickerTextColor, backgroundColor: 'transparent', height: undefined, paddingVertical: scale(4) }}
          dropdownIconColor={pickerTextColor}
          {...props}
        >
          {placeholder && <Picker.Item label={placeholder} value="" enabled={false} />}
          {items.map((item) => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
        </Picker>
      </View>
    );
  }

  // iOS Picker
  return (
    <Picker
      key={accessibility.colorTheme}
      enabled={enabled && !disabled}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={[ { color: textColor, fontSize, borderColor, borderWidth: 1, borderRadius: scale(8), paddingVertical: scale(6), paddingHorizontal: scale(12), marginBottom: scale(12), backgroundColor }, iosPickerStyle ]}
      {...props}
    >
      {placeholder && <Picker.Item label={placeholder} value="" enabled={false} />}
      {items.map((item) => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
    </Picker>
  );
};

export default ThemedPicker;
