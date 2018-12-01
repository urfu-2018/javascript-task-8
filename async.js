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
        return Promise.resolve(jobs);
    }

    parallelNum = Math.min(parallelNum, jobs.length);

    return new Promise(function (resolve) {
        const results = [];

        let currentId = 0;

        function createCb(jobId) {
            return function (result) {
                results[jobId] = result;

                if (results.length === jobs.length) {
                    return resolve(results);
                }

                if (currentId < jobs.length) {
                    processJob(currentId++);
                }
            };
        }

        function processJob(jobId) {
            const promise = jobs[jobId]();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(reject, timeout, new Error('Promise timeout')));

            const cb = createCb(jobId);

            Promise
                .race([promise, timeoutPromise])
                .then(cb, cb);
        }

        for (let id = 0; id < parallelNum; id++) {
            processJob(currentId++);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
