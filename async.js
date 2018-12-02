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
function runParallel(jobs, parallelNum = jobs.length, timeout = 1000) {
    return new Promise(resolve => {
        var currentJob = 0;
        var jobsResults = [];

        if (!jobs.length) {
            resolve(jobs);
        }
        var i = 0;
        while (i < parallelNum) {
            doJob(jobs[currentJob], currentJob++);
            i++;
        }

        function doJob(job, currentJobIndex) {
            const resolveResult = result => finishJob(result, currentJobIndex);
            promiseTimeout(timeout, job())
                .then(resolveResult, resolveResult);
        }

        function finishJob(result, index) {
            jobsResults[index] = result;
            if (jobsResults.length === jobs.length) {
                return resolve(jobsResults);
            }
            if (currentJob < jobs.length) {
                doJob(jobs[currentJob], currentJob++);
            }
        }
    });
}

function promiseTimeout(ms, promise) {
    let timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Promise timeout'));
        }, ms);
    });

    return Promise.race([
        promise,
        timeout
    ]);
}

module.exports = {
    runParallel,

    isStar
};
