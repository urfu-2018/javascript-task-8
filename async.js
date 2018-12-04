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
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        if (!jobs.length || parallelNum <= 0) {
            resolve([]);
        }
        let results = [];
        let startIndex = 0;
        for (; startIndex < parallelNum; startIndex++) {
            startJob(startIndex);
        }

        function startJob(jobIndex) {
            Promise.race([
                jobs[jobIndex](),
                new Promise((rejectTime) => {
                    setTimeout(rejectTime, timeout, new Error('Promise timeout'));
                })
            ])
                .then(jobResult => finishJob(jobResult, jobIndex));
        }

        function finishJob(jobResult, jobIndex) {
            results[jobIndex] = jobResult;
            if (startIndex < jobs.length) {
                startJob(startIndex++);
            }
            if (results.length === jobs.length) {
                resolve(results);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
