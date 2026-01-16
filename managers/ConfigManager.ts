// managers/ConfigManager.js
import Constants from 'expo-constants';

const ConfigManager = {
  getEnvironment: () => {
    return Constants.expoConfig.extra.ENVIRONMENT;
  },
};

export default ConfigManager;
