export default {
    logErrors: true,
    predicate: undefined,
    duration: false,
    timestamp: true,
    stateTransformer: state => state,
    actionTransformer: action => action,
    errorTransformer: error => error
};
