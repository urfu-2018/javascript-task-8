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
    let currentJobIndex = 0;
    const result = [];

    return new Promise(resolve => {
        const startNextJob = () => {
            if (result.length !== jobs.length) {
                return startJob(currentJobIndex++);
            }
            resolve(result);
        };
        if (jobs.length === 0 || parallelNum === 0) {
            resolve(result);
        }
        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            startNextJob();
        }

        function startJob(jobIndex) {
            const setResult = value => {
                result[jobIndex] = value;
            };

            return new Promise((jobResolve, jobReject) => {
                setTimeout(() => jobReject(new Error('Promise timeout')), timeout);
                jobs[jobIndex]().then(jobResolve, jobReject);
            }).then(setResult, setResult)
                .then(startNextJob);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
