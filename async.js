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
        let results = [];
        let jobNumber = 0;

        if (jobs.length === 0) {
            resolve([]);
        }

        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            runNextJob(jobNumber++);
        }

        function runNextJob(jobNum) {
            jobs[jobNum]().then(result => handleResult(result, jobNum));
        }

        function handleResult(res, jobNum) {
            results[jobNum] = res;

            if (results.length === jobs.length) {
                return resolve(results);
            }

            if (jobNumber < jobs.length) {
                runNextJob(jobNumber++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
