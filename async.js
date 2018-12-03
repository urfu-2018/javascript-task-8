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
        if (jobs.length === 0) {
            resolve([]);
        }

        let results = [];
        let jobNumber = 0;

        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            runNextJob(jobNumber++);
        }

        function runNextJob(jobNum) {

            function handleResult(res) {
                results[jobNum] = res;

                if (results.length === jobs.length) {
                    return resolve(results);
                }

                if (jobNumber < jobs.length) {
                    runNextJob(jobNumber++);
                }
            }

            Promise.race([
                jobs[jobNum](),
                new Promise((_, reject) => {
                    setTimeout(reject, timeout, new Error('Timeout error'));
                })
            ]).then(handleResult, handleResult);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
