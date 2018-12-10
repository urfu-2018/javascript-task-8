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
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }
    const result = [];
    let jobIndex = 0;

    return new Promise(
        resolve => {
            while (jobIndex < parallelNum) {
                execute(jobIndex++);
            }

            function execute(index) {
                Promise.race([jobs[index](), new Promise((res, reject) => {
                    setTimeout(reject, timeout, new Error('Promise timeout'));
                })])
                    .then(finished(index), finished(index));
            }

            function finished(index) {
                return function (res) {
                    result[index] = res;
                    if (result.length === jobs.length) {
                        resolve(result);
                    }
                    if (jobIndex < jobs.length) {
                        execute(jobIndex++);
                    }
                };
            }
        }
    );
}

module.exports = {
    runParallel,

    isStar
};
