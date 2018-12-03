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
    const result = [];
    const threads = [];
    for (let i = 0; i < parallelNum && i < jobs.length; i++) {
        threads.push(runThread());
    }
    await Promise.all(threads);

    async function runThread() {
        const index = result.length;
        result[index] = await jobs[index]().then(value => value, error => error);
        if (result.length < jobs.length) {
            await runThread();
        }
    }

    return new Promise((resolve) => resolve(result));
}

module.exports = {
    runParallel,

    isStar
};
