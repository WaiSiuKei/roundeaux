export function flushBuffer(buffer) {
    buffer.forEach((logEntry, key) => {
        const { started, startedTime, action, prevState, error } = logEntry;
        let { took, nextState } = logEntry;
        const nextEntry = buffer[key + 1];
        console.log(logEntry);
    });
}
