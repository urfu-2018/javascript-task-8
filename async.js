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
    const result = [];
    let startedJobsCount = 0;
    let finishedJobsCount = 0;

    return new Promise(resolve => {
        if (jobs.length === 0) {
            resolve(result);
        } else {
            while (startedJobsCount < parallelNum && startedJobsCount < jobs.length) {
                start(startedJobsCount, resolve);
                startedJobsCount++;
            }
        }
    });

    function start(jobNumber, resolve) {
        const takeResult = jobResult => getResult(jobNumber, jobResult, resolve);
        jobProcess(jobNumber).then(takeResult, takeResult);
    }

    function jobProcess(jobNumber) {
        return new Promise((resolveJob, rejectJob) => {
            jobs[jobNumber]().then(resolveJob, rejectJob);
            setTimeout(() => rejectJob(new Error('Promise timeout')), timeout);
        });
    }

    function getResult(jobNumber, jobResult, resolve) {
        result[jobNumber] = jobResult;
        finishedJobsCount++;
        if (finishedJobsCount === jobs.length) {
            resolve(result);
        }
        if (startedJobsCount < jobs.length) {
            start(startedJobsCount, resolve);
            startedJobsCount++;
        }
    }
}

module.exports = {
    runParallel,

    isStar
};
