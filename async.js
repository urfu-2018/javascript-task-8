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
    console.info(parallelNum);
    const result = [];
    for (const job of jobs) {
        result.push(await (job()));
    }

    return new Promise((resolve) => resolve(result));
}

module.exports = {
    runParallel,

    isStar
};
