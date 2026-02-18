jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
  FontAwesome: 'FontAwesome',
  Ionicons: 'Ionicons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  MaterialIcons: 'MaterialIcons',
}));

jest.mock('expo-localization', () => ({
  locale: 'en',
  getLocales: () => [{ languageTag: 'en-US', languageCode: 'en' }],
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: any }) => children,
}));
