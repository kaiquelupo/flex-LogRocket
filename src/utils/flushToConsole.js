import { FlexUILog, FlexUICoreLog } from '@twilio/flex-ui';
import LogRocket from 'logrocket';

const flush = (logger, title) => {

    var originalFactory = logger.methodFactory;
    logger.methodFactory = function (methodName, logLevel, loggerName) {

        var rawMethod = originalFactory(methodName, logLevel, loggerName);

        return function (...args) {
            let messages = [];

            for (var i = 0; i < args.length; i++) {
                messages.push(args[i]);
            }

            rawMethod.apply(undefined, messages);

            const { description, objects } = formatMessage(messages, title);

            if(objects) {

                LogRocket[methodName](description, objects);

            } else {

                LogRocket[methodName](description);

            }
        }
    };
    
    logger.setLevel(logger.getLevel());

}

const formatMessage = (messages, title) => {

    let objects = {};
    let description = `[${title}] `;

    messages.forEach((elem) => {
        if(typeof elem === "string") {

            description = description + " " + elem;

        } else {

            objects = { ...objects, ...elem };

        }
    });

    return {
        description,
        objects: Object.keys(objects).length > 0 ? objects : null
    }
}


export default () => {
    flush(FlexUILog, "@twilio-flex-ui");
    flush(FlexUICoreLog, "@twilio-flex-ui-core");
}