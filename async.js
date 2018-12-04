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
    const indexJobs = jobs.map((job, index) => ({ job, index }));
    const result = [];
    let finishedJobs = 0;

    if (!jobs.length) {
        return Promise.resolve(result);
    }

    return new Promise(resolve => {
        function setResult(data, index) {
            result[index] = data;
            finishedJobs++;
        }

        const beginWork = () => {
            if (finishedJobs === jobs.length) {
                resolve(result);
            }
            if (indexJobs.length) {
                let indexJob = indexJobs.shift();

                let timeoutPromise = new Promise((res, reject) => {
                    setTimeout(() => reject(new Error('Promise timeout')), timeout);
                });
                Promise.race([timeoutPromise, indexJob.job()])
                    .then(data => setResult(data, indexJob.index),
                        data => setResult(data, indexJob.index))
                    .then(beginWork);
            }
        };

        for (let i = 0; i < jobs.length && i < parallelNum; i++) {
            beginWork();
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
