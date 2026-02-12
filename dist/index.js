"use strict";
// 1. Створіть тип FilterCallback. Функція, яка приймає value (строку або число) і повертає boolean.
// Використовуйте цей тип для параметра predicate у функції filterItems.
function filterItems(items, predicate) {
    const result = [];
    for (const item of items) {
        if (!predicate(item))
            continue;
        result.push(item);
    }
    return result;
}
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = filterItems(numbers, value => typeof value === 'number' && value % 2 === 0);
function sendEvent(eventType, ...payload) {
    console.info(`Event: ${eventType}, Data: ${payload.join(', ')}`);
}
function runCommand(command, ...args) {
    if (command === 'get-health') {
        return 100;
    }
    if (command === 'get-status') {
        return 'Stunned';
    }
    if (command === 'search-area') {
        return ['Rock', 'Tree', 'Chest'];
    }
    if (command === 'spawn-creep') {
        return { id: Math.random(), type: args[0] };
    }
    throw new Error('Unknown command');
}
const calculateDamage = function (min, max) {
    const dmg = Math.floor(Math.random() * (max - min) + min);
    calculateDamage.history.push(dmg);
    return dmg;
};
calculateDamage.history = [];
calculateDamage.showHistory = function () {
    console.info('History:', calculateDamage.history);
};
function assertNever(value) {
    throw new Error(`Unhandled state: ${value}`);
}
function processState(state) {
    switch (state) {
        case 'Loading':
            return 'Please wait...';
        case 'Playing':
            return 'Game is on!';
        case 'Paused':
            return 'Press Start to continue';
        default:
            return assertNever(state);
    }
}
