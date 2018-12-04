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
async function runParallel(jobs, parallelNum, timeout = 1000) {
    const queue = [];
    const result = [];
    const jobDone = (response, promise, jobIndex) => {
        queue.splice(queue.indexOf(promise), 1);
        result[jobIndex] = response;
    };

    for (const [index, job] of jobs.entries()) {
        const promise = Promise.race([
            job().then(
                resolve => jobDone(resolve, promise, index),
                error => jobDone(error, promise, index)
            ),
            new Promise(resolve => {
                setTimeout(resolve, timeout, new Error('Promise timeout'));
            }).then(error => jobDone(error, promise, index))
        ]);
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
