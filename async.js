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
    for (const [index, job] of jobs.entries()) {
        const queueLength = queue.length;
        const jobDone = response => {
            queue.splice(queueLength, 1);
            result[index] = response;
        };
        const promise = job().then(jobDone, jobDone);
        queue.push(promise);
        if (queueLength >= parallelNum) {
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
