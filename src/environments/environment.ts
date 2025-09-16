export const environment = {
  production: false,
  apiUrl: 'https://api.petsz.shop',
  appName: 'Adote um Amigo',
  version: '1.0.0',
  features: {
    enableNotifications: true,
    enableAnalytics: false,
    debugMode: true
  },
  api: {
    timeout: 30000,
    retryAttempts: 3
  }
};
