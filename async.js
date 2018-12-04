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

        const results = [];
        let currentJobIndex = 0;

        function pushToArrayResultOfJob(jobIndex) {
            return function (result) {
                results[jobIndex] = result;
                if (results.length === jobs.length) {
                    return resolve(results);
                }
                if (currentJobIndex < jobs.length) {
                    tryDoJobQuickerTimout(currentJobIndex++);
                }
            };
        }

        for (let i = 0; i < parallelNum; i++) {
            tryDoJobQuickerTimout(currentJobIndex++);
        }

        function tryDoJobQuickerTimout(jobIndex) {
            const callBack = pushToArrayResultOfJob(jobIndex);

            Promise
                .race([jobs[jobIndex](), new Promise((_, reject) =>
                    setTimeout(reject, timeout, new Error('Promise timeout')))
                ])
                .then(callBack, callBack);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
