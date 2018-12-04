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
    if (!jobs.length || parallelNum <= 0) {
        return Promise.resolve([]);
    }

    let processingId = 0;
    let handledCount = 0;
    let results = [];

    return new Promise(resolve => {

        for (let i = 0; i < Math.min(parallelNum, jobs.length); i++) {
            runWorker();
        }

        function runWorker() {
            if (processingId < jobs.length) {
                runJob(processingId++)
                    .then(() => handledCount++)
                    .then(runWorker);
            }
            if (handledCount === jobs.length) {
                resolve(results);
            }
        }

        function runJob(jobId) {
            function setResult(value) {
                results[jobId] = value;
            }

            return new Promise((jobResolve, jobReject) => {
                setTimeout(() => jobReject(new Error('Promise timeout')), timeout);
                jobs[jobId]().then(jobResolve, jobReject);
            }).then(setResult, setResult);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
