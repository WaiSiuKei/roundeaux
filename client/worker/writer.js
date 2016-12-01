import diff from './diffCalculator'
import { STORE } from './constant'

let pervId = Date.now()
let prevTimeStamp = pervId

function writer(db, logEntry) {
    const { level, data } = logEntry
    const {
        prevState = {},
        nextState = {},
        action: actionData,
        startTime,
        duration
        } = data
    const { type: actionType } = actionData
    delete actionData.type
    let toWrite = {
        diff: diff(prevState, nextState),
        actionType,
        actionData,
        startTime,
        duration,
        level
    }
    const transaction = db.transaction(STORE, "readwrite");
    const objectStore = transaction.objectStore(STORE);
    toWrite.id = Date.now()
    let now = Date.now()
    if (Math.floor(prevTimeStamp) === Math.floor(now)) {
        toWrite.id = prevId + 0.00001;
        prevId = toWrite.id;
    } else {
        toWrite.id = now
    }
    objectStore.add(toWrite)
}

export default writer
