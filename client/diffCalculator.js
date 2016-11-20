import DiffPatcher from './DiffPatcher';

export default function diffCalculator(fromState, toState) {
    return fromState && toState && DiffPatcher.diff(fromInspectedState, toInspectedState);
}
