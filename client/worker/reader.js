import { STORE } from './constant'

export function readAllEntities(db) {
    return new Promise((resolve) => {
        let transaction = db.transaction(STORE, 'readonly')
        let objectStore = transaction.objectStore(STORE)
        let entities = []
        objectStore.openCursor().onsuccess = (event) => {
            var cursor = event.target.result;
            if (cursor) {
                entities.push(cursor.value)
                cursor.continue();
            } else {
                resolve(entities)
            }
        };
    })
}
