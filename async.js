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
    let results = new Array(jobs.length);
    let startJobs = 0;
    let finishedJobs = 0;

    return new Promise(resolve => {
        if (!jobs.length) {
            resolve(results);
        }
        while (startJobs < parallelNum) {
            runJob(startJobs++, resolve);
        }
    });

    function finishJobWithTimeout(jobIndex) {
        return new Promise((timeResolve, timeReject) => {
            jobs[jobIndex]()
                .then(timeResolve, timeReject);
            setTimeout(timeReject, timeout, new Error('Promise timeout'));
        });
    }

    function runJob(indexJob, resolve) {
        let jobResult = result => finishJob(result, indexJob, resolve);

        return finishJobWithTimeout(indexJob).then(jobResult)
            .catch(jobResult);
    }

    function finishJob(result, jobIndex, resolve) {
        results[jobIndex] = result;
        finishedJobs++;
        if (finishedJobs === jobs.length) {
            resolve(results);
        } else if (startJobs < jobs.length) {
            runJob(startJobs++, resolve);
        }
    }
}

module.exports = {
    runParallel,

    isStar
};
