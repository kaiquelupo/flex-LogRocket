import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
// import flushToConsole from './utils/flushToConsole';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'LogRocketPlugin';

export default class LogRocketPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    this.registerReducers(manager);
    
    manager.updateConfig({
      ...manager.configuration,
      logLevel: "debug"
    });
    
    // TODO: wait for Flex change to allow this functionality 
    //flushToConsole();

    LogRocket.init('jsuv4u/operation-mixed-infra');

    const { sid, name, attributes: { email } } = 
      manager.workerClient;

    LogRocket.identify(sid, {
      name,
      email
    });

    setupLogRocketReact(LogRocket);


  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
