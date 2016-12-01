import writer from './writer'
import reader from './reader'
import messager from './messager'
import upgrader from './upgrader'
import { DB } from './constant'

const request = indexedDB.open(DB)

request.onupgradeneeded = () => {
    upgrader(request)
};

request.onsuccess = () => {
    const db = request.result;
    const actionHandlers = {
        'logging': writer,
        'remote': messager
    }

    onmessage = (e) => {
        const { data } = e
        const { action } = data
        const handler = actionHandlers[action]
        handler(db, data)
    }
}

