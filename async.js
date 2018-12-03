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
    console.info(jobs, parallelNum, timeout);

    return new Promise(resolve => {
        const result = [];
        let startedCount = 0;

        if (jobs.length === 0 || parallelNum <= 0) {
            resolve([]);
        }

        while (startedCount < parallelNum) {
            startPromise(startedCount++);
        }

        function startPromise(jobIndex) {
            return handler(jobIndex)
                .then(resolve1 => finishPromise(resolve1, jobIndex))
                .catch(resolve1 => finishPromise(resolve1, jobIndex));
        }

        function handler(jobIndex) {
            return new Promise((resolve2, reject) => {
                jobs[jobIndex]()
                    .then(resolve2, reject);
                setTimeout(reject, timeout, new Error('Promise timeout'));
            });
        }

        function finishPromise(res, jobIndex) {
            result[jobIndex] = res;

            if (startedCount < jobs.length) {
                startPromise(startedCount++);
            } else if (jobs.length === result.length) {
                resolve(result);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
