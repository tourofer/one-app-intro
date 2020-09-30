const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const isCI = Boolean(process.env.CI || process.env.IS_BUILD_AGENT);

describe('Generate module.json', () => {
  let config;

  beforeEach(async () => {
    config = JSON.parse(process.env.MODULE_JSON_CONFIG);
    __DEV__ = true;
  });

  it('should generate module.json', async () => {
    config.module_names.forEach((moduleName) => {
      applyGenericMocks();
      applyModuleMocks(moduleName);
      const json = generateModuleJson(moduleName);
      writeModuleJson(moduleName, config.target_folder, config.artifacts_folder, json);
    });
  });

  function applyGenericMocks() {
    // TODO: Module specific mocks should be moved to the appropriate moduels
    try {
      jest.mock('wix-react-native-ui-lib', () => ({
        Assets: {
          icons: {
            tabs: {},
            general: {},
            navigation: {},
            apps: {},
            quickActions: {}
          },
          illustrations: {}
        },
        Typography: {},
        Colors: {
          rgba: jest.fn()
        },
        Shadows: {
          dark20: {bottom: {}},
          white30: {},
          white40: {},
          sh10: {}
        },
        Constants: {
          isIOS: true
        },
        Ids: {},
        Toast: {
          presets: {}
        },
        BorderRadiuses: {},
        Spacings: {},
        Dividers: {},
        withConnectionState: jest.fn((...args) => args),
        asWixScreen: jest.fn(),
        asConnectedKeyboard: jest.fn(),
      }));
    } catch {}

    try {
      jest.mock('wix-react-native-ui-lib/src', () => ({
        Assets: {
          icons: {
            tabs: {},
            general: {},
            navigation: {},
            apps: {}
          },
          illustrations: {}
        },
      }));
    } catch {}

    try {
      jest.mock('react-native-ui-lib', () => ({
        Colors: {},
        PureBaseComponent: class A {},
        BaseComponent: class A {}
      }));
    } catch {}

    try {
      jest.mock('react-native-wix-media', () => ({
        WixMediaApi: jest.fn()
      }));
    } catch {}

    try {
      jest.mock('wix-one-app-storage', () => ({
        __esModule: true,
        namedExport: jest.fn(),
        default: jest.fn((prefix) => ({
          prefix,
          saveByBusiness: jest.fn(),
          loadGlobal: jest.fn(() => Promise.resolve(true))
        })),
        createModelStorage() {
          return {
            model() {
              return ({
                save: jest.fn(),
                delete: jest.fn(),
                query: jest.fn(),
              });
            },
            connect: jest.fn()
          };
        }
      }));
    } catch {}

    try {
      jest.mock('wix-one-app-engine/lib/NativeComponents', () => ({
        __esModule: true,
        namedExport: jest.fn(),
        NativeComponents: {
          VideoView: {}
        }
      }));
    } catch {}

    try {
      jest.mock('wix-one-app-engine/lib/MockTools');
    } catch {}

    try {
      jest.mock('@react-native-community/async-storage', () => ({
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
      }));
    } catch {}

    try {
      jest.mock('@react-native-community/slider', () => ({}));
    } catch {}

    try {
      jest.mock('@react-native-community/blur', () => ({}));
    } catch {}

    try {
      jest.mock('@react-native-community/audio-toolkit', () => ({}));
    } catch {}

    try {
      jest.mock('wix-react-native-storybook-template', () => ({}));
    } catch {}

    try {
      jest.mock('recompose', () => ({
        compose: () => () => () => {},
        hoistStatics: jest.fn(),
        withProps: jest.fn(),
        withHandlers: jest.fn(),
        withState: jest.fn(),
        lifecycle: jest.fn(),
        renderComponent: jest.fn(),
        branch: jest.fn(),
      }));
    } catch{}

    try {
      jest.mock('react-native-navigation', () => ({
        Navigation: {
          setRoot: jest.fn(),
          setDefaultOptions: jest.fn(),
          push: jest.fn(),
          pop: jest.fn(),
          popTo: jest.fn(),
          popToRoot: jest.fn(() => Promise.resolve(true)),
          mergeOptions: jest.fn(),
          showModal: jest.fn(),
          dismissModal: jest.fn(),
          dismissAllModals: jest.fn(),
          showOverlay: jest.fn(),
          dismissOverlay: jest.fn(),
          setStackRoot: jest.fn(),
          registerComponent: jest.fn(),
          setLazyComponentRegistrator: jest.fn(),
          events: jest.fn().mockReturnValue({
            registerBottomTabSelectedListener: () => {
              return {
                remove: jest.fn()
              };
            },
            registerComponentDidAppearListener: () => {
              return {
                remove: jest.fn()
              };
            },
            registerComponentDidDisappearListener: () => {
              return {
                remove: jest.fn()
              };
            },
            registerCommandListener: () => {
              return {
                remove: jest.fn()
              };
            },
            registerNavigationButtonPressedListener: () => ({remove: jest.fn()}),
            componentEventsObserver: {
              listeners: [],
            },
          })
        },
      }));
    } catch {}

    try {
      jest.mock('react-native-notifications', () => ({
        Notifications: {
          postLocalNotification: jest.fn(() => Promise.resolve(true))
        }
      }));
    } catch {}

    try {
      jest.mock('react-redux', () => ({
        connect: () => jest.fn(() => {})
      }));
    } catch {}

    try {
      jest.mock('remote-redux-devtools', () => ({
        composeWithDevTools: jest.fn()
      }));
    } catch {}

    try {
      jest.mock('react-native-fs', () => {});
    } catch {}

    try {
      jest.mock('promote-mobile-common', () => ({
        createCommonStore: jest.fn(),
        layoutHelper: {getTopContainerWidth: jest.fn()},
        analytics: {actions: {}},
        navigation: {actions: {}},
        utils: {commons: {}},
      }));
    } catch {}

    try {
      jest.mock('wix-react-native-social', () => {});
    } catch {}

    jest.mock('react-native', () => ({
      NativeModules: {
        RNMediaManager: {}
      },
      NativeEventEmitter: {},
      Platform: {
        OS: 'ios',
        select: jest.fn()
      },
      requireNativeComponent: jest.fn(),
      Dimensions: {get: jest.fn(() => ({width: 0, height: 0}))},
      PixelRatio: {get: jest.fn()},
      StyleSheet: {create: jest.fn((o) => o), flatten: jest.fn()},
      Animated: {
        timing: jest.fn()
      }
    }));
    jest.mock('react-native-device-info', () => ({}));
    jest.mock('react-native-simple-store', () => ({}));
    jest.mock('react-native-share', () => ({}));
    jest.mock('react-native-keyboard-input', () => ({}));
    jest.mock('react-native-video', () => ({}));
    jest.mock('@react-native-firebase/analytics', () => {
      return () => {
        return {logEvent: jest.fn()};
      };
    });
    global.engine = {
      createFedops: jest.fn(() => ({
        interactionStarted: jest.fn(),
        appLoadStarted: jest.fn()
      })),
      state: {
        system: {
        },
        user: {
          email: 'user@email.com'
        },
        experiments: {
          isEnabled: jest.fn(() => false)
        },
        businesses: {
          onBusinessListChange: jest.fn()
        }
      },
      moduleRegistry: {
        invoke: jest.fn(),
        registeredComponents: {},
        registeredMethods: {},
        hasMethod: jest.fn()
      },
      bi: {
        logger: jest.fn(() => () => {}),
        log: jest.fn()
      }
    };
    global.window = {};
  }

  function applyModuleMocks(moduleName) {
    const modulePath = config.module_roots_map[moduleName];
    if (!modulePath) {
      return;
    }
    const moduleMocksFile = path.resolve(config.module_roots_map[moduleName], 'engineModuleMocks.js');
    if (fs.existsSync(moduleMocksFile)) {
      console.log(`Found additional mocks file for ${moduleName}`);
      const applyMocks = require(moduleMocksFile).applyMocks;
      if (_.isFunction(applyMocks)) {
        try {
          applyMocks();
        } catch {}
      }
    }
  }

  function hasValues(result) {
    return result && _.isArray(result) && result.length > 0;
  }

  function generateModuleJson(moduleName) {
    const module = new (require(`${moduleName}`).default)();
    const prefix = module.prefix();
    const components = module.components && module.components();
    const methods = module.methods && module.methods();
    const deeplinks = module.deepLinks && module.deepLinks();
    const consumedServices = module.consumedServices && module.consumedServices();
    const providedServices = module.providedServices && module.providedServices();
    const modes = module.modes && module.modes();
    const biSources = module.biSources ? module.biSources() : undefined;
    return {
      name: moduleName,
      prefix,
      components: hasValues(components) ? components.map((c) => c.id) : undefined,
      methods: hasValues(methods) ? methods.map((m) => m.id) : undefined,
      deepLinks: hasValues(deeplinks) ? deeplinks.map((l) => ({
        linkPattern: l.linkPattern,
        externalPatterns: l.externalPatterns,
        pushNotificationCategories: l.pushNotificationCategories
      })) : undefined,
      hasTabs: !!(module.getTabs) || !!(module.tabs),
      consumedServices: consumedServices ? Object.keys(consumedServices).map((cs) => {
        return _.isFunction(cs) ? cs() : cs;
      }) : undefined,
      providedServices: providedServices ? Object.keys(providedServices).map((ps) => {
        return _.isFunction(ps) ? ps() : ps;
      }) : undefined,
      hasDemoInit: !!(module.__unsafe__initializeDemoModule),
      hasManagerApps: !!(module.managerApps),
      hasClientApps: !!(module.clientApps),
      hasInstallableApps: !!(module.installableApps) || !!(module.getInstallableApps),
      hasQuickActions: !!(module.quickActions),
      hasActivityScreens: !!(module.activityScreens) || !!(module.getActivityScreens),
      modes: modes ? Object.keys(modes) : undefined,
      defaultMode: modes ? Object.keys(modes).find((m) => modes[m].isDefault === true) : undefined,
      biSources
    };
  }

  function writeModuleJson(moduleName, targetFolder, artifactsFolder, moduleJson) {
    fs.writeFileSync(`${targetFolder}/module_js/${moduleName}.json`, JSON.stringify(moduleJson || {}, null, 2));
    if (isCI && artifactsFolder) {
      fs.writeFileSync(`${artifactsFolder}/module_js/${moduleName}.json`, JSON.stringify(moduleJson || {}, null, 2));
    }
  }

});
