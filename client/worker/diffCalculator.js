import jsondiffpatch from 'jsondiffpatch'

const diffpatcher = jsondiffpatch.create({
    arrays: { detectMove: false },
    objectHash: (o, idx) =>
        typeof o === 'object' && o.hasOwnProperty('id') ? o.id : '$$index:' + idx,
    propertyFilter: (name, context) =>
    typeof context.left[name] !== 'function' &&
    typeof context.right[name] !== 'function'
})

export default function diff(fromState, toState) {
    return fromState && toState && diffpatcher.diff(fromState, toState)
}

