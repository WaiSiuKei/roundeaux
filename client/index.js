import timer from './timer'
import defaults from './defaults'
import LogWorker from "worker-loader!./worker"

/**
 * Creates logger with following options
 *
 * @namespace
 * @param {object} options - options for logger
 * @param {boolean} options.duration - print duration of each action?
 * @param {boolean} options.timestamp - print timestamp with each action?
 * @param {boolean} options.logErrors - should errors in action execution be caught, logged, and re-thrown?
 * @param {boolean} options.predicate - condition which resolves logger behavior
 * @param {function} options.stateTransformer - transform state before print
 * @param {function} options.actionTransformer - transform action before print
 * @param {function} options.errorTransformer - transform error before print
 *
 * @returns {function} logger middleware
 */
function createLogger(options = {}) {
    const loggerOptions = {
        ...defaults,
        ...options,
    }

    const {
        stateTransformer,
        errorTransformer,
        actionTransformer,
        predicate,
        logErrors,
        } = loggerOptions

    // Return if 'console' object is not defined
    //if (typeof logger === `undefined`) {
    //    return () => next => action => next(action)
    //}

    const logBuffer = []
    const logWorker = new LogWorker()

    return ({ getState }) => (next) => (action) => {
        // Exit early if predicate function returns 'false'
        if (typeof predicate === `function` && !predicate(getState, action)) {
            return next(action)
        }

        const logEntry = {}
        logBuffer.push(logEntry)

        logEntry.started = timer.now()
        logEntry.startTime = (new Date()).toISOString()
        logEntry.prevState = stateTransformer(getState())
        logEntry.action = actionTransformer(action)

        let returnedValue
        if (logErrors) {
            try {
                returnedValue = next(action)
            } catch (e) {
                logEntry.error = errorTransformer(e)
            }
        } else {
            returnedValue = next(action)
        }

        logEntry.duration = timer.now() - logEntry.started
        logEntry.nextState = stateTransformer(getState())

        flushBuffer(logBuffer, logWorker)
        logBuffer.length = 0

        if (logEntry.error) throw logEntry.error
        return returnedValue
    }
}

function flushBuffer(buffer, worker) {
    buffer.forEach((logEntry, key) => {
        const { started, startedTime, action, prevState, error } = logEntry
        let { duration, nextState } = logEntry
        const nextEntry = buffer[key + 1]
        worker.postMessage({
            data: logEntry,
            type: 'insert'
        })
    })
}

export default createLogger
