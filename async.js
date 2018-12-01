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
    let currentJobIndex = 0;
    let finishedJobsCount = 0;

    return new Promise(resolve => {
        const startWorker = () => {
            if (currentJobIndex < jobs.length) {
                startJob(currentJobIndex++)
                    .then(() => finishedJobsCount++)
                    .then(startWorker);
            }
            if (finishedJobsCount === jobs.length) {
                resolve(result);
            }
        };
        if (jobs.length === 0 || parallelNum === 0) {
            resolve(result);
        }
        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            startWorker();
        }

        function startJob(jobIndex) {
            const setResult = value => {
                result[jobIndex] = value;
            };

            return new Promise((jobResolve, jobReject) => {
                setTimeout(() => jobReject(new Error('Promise timeout')), timeout);
                jobs[jobIndex]().then(jobResolve, jobReject);
            }).then(setResult, setResult);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
