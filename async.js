'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    return new Promise(resolve => {
        let jobsDone = 0;
        let currentJob = 0;
        const jobsResults = new Array(jobs.length);
        const lowerBound = Math.min(jobs.length, parallelNum);

        const runJobAsync = function (jobNumber) {
            const saveResultCb = function (data) {
                jobsResults[jobNumber] = data;
                if (++jobsDone === jobs.length) {
                    return resolve(jobsResults);
                }

                if (currentJob < jobs.length) {
                    runJobAsync(currentJob);
                    currentJob++;
                }
            };

            runJobAsyncWithTimeout(jobs[jobNumber], saveResultCb, timeout);
        };

        for (currentJob; currentJob < lowerBound; currentJob++) {
            runJobAsync(currentJob);
        }
    });
}

function runJobAsyncWithTimeout(job, callback, ms) {
    return Promise
        .race([job(), setPromiseTimeout(ms)])
        .then(callback, callback);
}

function setPromiseTimeout(ms) {
    return new Promise((resolve, reject) =>
        setTimeout(() => reject(new Error('Promise timeout')), ms));
}

module.exports = {
    runParallel,

    isStar
};
