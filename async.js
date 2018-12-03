'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum) {
    return new Promise(resolve => {
        if (jobs.length === 0) {
            return resolve([]);
        }

        const results = [];
        let currentJobIndex = 0;

        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            doJob(currentJobIndex++);
        }

        function createCallBack(jobIndex) {
            return function (result) {
                results[jobIndex] = result;
                if (results.length === jobs.length) {
                    return resolve(result);
                }
                if (jobIndex < jobs.length) {
                    doJob(currentJobIndex++);
                }
            };
        }

        function doJob(jobIndex) {
            const callBack = createCallBack(jobIndex);

            jobs[jobIndex]().then(callBack, callBack);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
