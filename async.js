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
async function runParallel(jobs, parallelNum/* timeout = 1000 */) {
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }
    const result = [];
    while (jobs.length !== 0) {
        const currentJobs = jobs.splice(0, parallelNum);
        const currentResult = await Promise.all(currentJobs.map(doJob));
        result.push(...currentResult);
    }

    return Promise.resolve(result);
}

async function doJob(job) {
    try {
        return job();
    } catch (error) {
        return error;
    }
}

module.exports = {
    runParallel,

    isStar
};
