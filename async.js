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
        let jobsResult = [];
        let jobId = 0;
        while (jobId < parallelNum) {
            doJob(jobId++);
        }

        async function doJob(index) {
            const currentJob = jobs[index];
            const timer = new Promise((_, reject) =>
                setTimeout(reject, timeout, new Error('Promise timeout')));
            jobsResult[index] = Promise.race([currentJob(), timer]).then(res => res, er => er);
            if (jobsResult.length === jobs.length) {
                resolve(jobsResult);
            }
            if (jobId < jobs.length) {
                doJob(jobId++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
