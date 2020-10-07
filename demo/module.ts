
export default class CreationDemo {

  __unsafe__initializeDemoModule() {
    const mockTools = require('wix-one-app-engine/lib/MockTools')
    
    const mockMode = mockTools.getLoginMode();
    //provide the mock data depending on what mock level the packager is running at
    switch (mockMode) {
      case 'quickLogin':
        console.log('setting fake login credentials')
        mockTools.setLoginDataFromLocalConfigFile();
        break;
      case 'offline':
        // Should be set in e2e tests
        break;

      default:
        console.warn('Unhandled mock Mode: ' + mockMode);
    }
  }


  prefix() {
    return 'ofer_intro-demo';
  }

}


