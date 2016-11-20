// Use performance API if it's available in order to get better precision
const timer = (typeof performance !== `undefined` && performance !== null) && typeof performance.now === `function` ? performance : Date;

export default timer;
