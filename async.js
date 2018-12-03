'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
async function runParallel(jobs, parallelNum) {
    const queue = [];
    const result = [];
    for (let job of jobs) {
        const promise = job().then(resolve => {
            queue.splice(queue.indexOf(promise), 1);
            result.push(resolve);
        }, resolve => {
            queue.splice(queue.indexOf(promise), 1);
            result.push(resolve);
        });
        queue.push(promise);
        if (queue.length >= parallelNum) {
            await Promise.race(queue);
        }
    }
    await Promise.all(queue);

    return result;
}
module.exports = {
    runParallel,

    isStar
};
