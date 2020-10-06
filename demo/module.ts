import { LogBox } from 'react-native';
import MockTools from 'wix-one-app-engine/lib/MockTools';

export default class CreationDemo {

  __unsafe__initializeDemoModule() {
    const mockMode = MockTools.getLoginMode();
    //provide the mock data depending on what mock level the packager is running at
    switch (mockMode) {
      case 'quickLogin':
        mockProduction();
        break;
      case 'offline':
        // Should be set in e2e tests
        break;

      default:
        console.warn('Unhandled mock Mode: ' + mockMode);
    }
  }


  init() {
    LogBox.ignoreAllLogs(true)
  }

  prefix() {
    return 'ofer_intro-demo';
  }

}

function mockProduction() {
  console.log('setting fake login credentials')
  const {credentials} = require('../credentials');
  MockTools.setLoginData({loginCredentials: credentials});
}

