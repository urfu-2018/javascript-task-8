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
        let currentJobID = 0;
        const cache = [];
        if (jobs.length === 0) {
            return resolve([]);
        }
        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            enqueueJob(currentJobID++);
        }

        function enqueueJob(jobID) {
            const finishCallback = currentResult => {
                cache[jobID] = currentResult;
                if (cache.length === jobs.length) {
                    return resolve(cache);
                }
                if (currentJobID < jobs.length) {
                    enqueueJob(currentJobID++);
                }
            };
            Promise.race([
                jobs[jobID](),
                new Promise((_, reject) => {
                    setTimeout(reject, timeout, new Error('Promise timeout'));
                })
            ]).then(finishCallback, finishCallback);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
