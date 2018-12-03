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
    // асинхронная магия

    if (!jobs.length || parallelNum <= 0) {
        return Promise.resolve([]);
    }

    return new Promise((resolve) => {
        let results = [];

        let completeJobs = 0;
        let index = 0;

        function handleJobEnd(id, result) {
            results[id] = result;
            completeJobs++;
            if (completeJobs >= jobs.length) {
                resolve(results);
            } else {
                runNextJob();
            }
        }

        function runNextJob() {
            executeJob(jobs[index], timeout).then(res => handleJobEnd(index, res));
            index++;
        }

        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            runNextJob();
        }
    });
}

function executeJob(job, timeout) {
    return nonFailPromise(timeoutPromise(job(), timeout));
}

function timeoutPromise(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((resolve, reject) => {
            setTimeout(reject, timeout, new Error('Promise timeout'));
        })
    ]);
}

function nonFailPromise(promise) {
    return new Promise((resolve) => promise.then(resolve, resolve));
}

module.exports = {
    runParallel,

    isStar
};
