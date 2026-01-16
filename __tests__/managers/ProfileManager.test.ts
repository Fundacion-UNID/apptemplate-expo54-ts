// __tests__/managers/ProfileManager.test.js

import ProfileManager from '../../managers/ProfileManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage & Crypto
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('expo-crypto', () => ({
  ...jest.requireActual('expo-crypto'),
  randomUUID: jest.fn(() => 'mock-profile-uuid-12345'),
}));


describe('ProfileManager', () => {

  beforeEach(() => {
    // Clear mocks and reset the manager's state before each test
    AsyncStorage.setItem.mockClear();
    AsyncStorage.getItem.mockClear();
    ProfileManager.setCurrentProfile(null);
  });

  it('should create a new anonymous profile, save it to storage, and set it as active', async () => {
    // --- Action ---
    const newProfile = await ProfileManager.createNewAnonymousProfile();

    // --- Verification ---
    // 1. Check the returned profile object
    expect(newProfile).toBeDefined();
    expect(newProfile.id).toBeDefined();
    expect(newProfile.isAnonymous).toBe(true);

    // 2. Check if it was set as the current profile
    const currentProfile = ProfileManager.getCurrentProfile();
    expect(currentProfile).toEqual(newProfile);

    // 3. Check if it was saved correctly via the mock
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('profiles_list', JSON.stringify([newProfile]));
  });
});
