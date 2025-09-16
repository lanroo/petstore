export const environment = {
  production: true,
  apiUrl: 'https://api.petsz.shop',
  appName: 'Adote um Amigo',
  version: '1.0.0',
  features: {
    enableNotifications: true,
    enableAnalytics: true,
    debugMode: false
  },
  api: {
    timeout: 30000,
    retryAttempts: 3
  }
};
