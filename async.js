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
    let result = [];
    let startedJobsCount = 0;
    let finishedJobsCount = 0;

    return new Promise(resolve => {
        if (jobs.length === 0) {
            resolve([]);
        }
        while (startedJobsCount < parallelNum) {
            startJob(startedJobsCount++, resolve);
        }
    });

    function startJob(job, resolve) {
        let handler = jobResult => finishJob(jobResult, job, resolve);

        return new Promise((timeResolve, timeReject) => {
            jobs[job]().then(timeResolve, timeReject);
            setTimeout(() => timeReject(new Error('Promise timeout')), timeout);
        }).then(handler)
            .catch(handler);
    }

    function finishJob(jobResult, job, resolve) {
        result[job] = jobResult;
        if (jobs.length === ++finishedJobsCount) {
            resolve(result);
        }
        if (startedJobsCount < jobs.length) {
            startJob(startedJobsCount++, resolve);
        }
    }
}

module.exports = {
    runParallel,

    isStar
};
