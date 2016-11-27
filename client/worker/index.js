import test from './dbWriter'
import diff from './diffCalculator'

const DB = 'roundeaux'
const STORE = 'stateTransfer'

let request = indexedDB.open(DB)
let pervId = Date.now()
let prevTimeStamp = pervId
request.onupgradeneeded = function () {
    let db = request.result;
    let store = db.createObjectStore(STORE, { keyPath: 'id' });
    let timeStampIndex = store.createIndex('by-startTime', 'startTime', { unique: false });
};

request.onsuccess = function () {
    const db = request.result;

    onmessage = function (e) {
        const { data: params } = e
        const { type: logType, data } = params
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
            duration
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
};


