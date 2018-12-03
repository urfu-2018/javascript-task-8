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
        }

        while (startedJobsCount < parallelNum) {
            start(startedJobsCount++, resolve);
        }
    });

    function start(job, resolve) {
        let handler = jobResult => finish(jobResult, job, resolve);

        return new Promise((resolveJob, rejectJob) => {
            jobs[job]()
                .then(resolveJob, rejectJob);

            setTimeout(() => rejectJob(new Error('Promise timeout')), timeout);
        })
            .then(handler)
            .catch(handler);
    }

    function finish(jobResult, job, resolve) {
        result[job] = jobResult;

        if (jobs.length === ++finishedJobsCount) {
            resolve(result);
        }

        if (startedJobsCount < jobs.length) {
            start(startedJobsCount++, resolve);
        }
    }
}

module.exports = {
    runParallel,
    isStar
};
