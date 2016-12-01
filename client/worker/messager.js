import io from 'socket.io-client'
import { messageTypes } from './constant'
import * as reader from './reader'


let socket

export default function messager(db) {
    if (!socket) socket = io.connect(':3001');
    reader.readAllEntities(db).then((allEntities) => {
        socket.emit('ALL', JSON.stringify(allEntities))
    })
    //socket.on('GET_LOG_ENTITIES', (msg) => {
    //
    //})
}
