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
                Promise.race([jobs[index](), new Promise(reject => {
                    setTimeout(reject, timeout, new Error('Error!'));
                })])
                    .then(res => finished(res, index))
                    .catch(error => finished(error, index));
            }

            function finished(res, index) {
                result[index] = res;
                if (result.length === jobs.length) {
                    resolve(result);
                }
                if (index < jobs.length) {
                    execute(jobIndex++);
                }
            }
        }
    );
}

module.exports = {
    runParallel,

    isStar
};
