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
    return new Promise(resolve => {
        if (!jobs.length) {
            return resolve([]);
        }

        const results = new Map();
        let currentJobIndex = 0;

        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            doJob(currentJobIndex++);
        }

        function createCallBack(jobIndex) {
            return function (result) {
                results.set(jobIndex, result);
                if (results.size === jobs.length) {
                    const resolveValue = Array.from(results)
                        .sort((job1, job2) => job1[0] - job2[0])
                        .map(([, job]) => job);

                    return resolve(resolveValue);
                }
                if (currentJobIndex < jobs.length) {
                    doJob(currentJobIndex++);
                }
            };
        }

        function doJob(jobIndex) {
            const callback = createCallBack(jobIndex);

            Promise.race([jobs[jobIndex](), new Promise((_, reject) =>
                setTimeout(reject, timeout, new Error('Promise timeout')))])
                .then(callback, callback);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
