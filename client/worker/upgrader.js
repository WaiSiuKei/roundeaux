import { STORE } from './constant'

export default function upgrader(request){
    let db = request.result;
    let store = db.createObjectStore(STORE, { keyPath: 'id' });
    let timeStampIndex = store.createIndex('by-startTime', 'startTime', { unique: false });
}
