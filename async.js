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
    const promiseCount = Math.min(jobs.length, parallelNum);
    let result = [];
    let jobIndex = 0;

    return new Promise(
        resolve => {
            for (let i = 0; i < promiseCount; i++) {
                execute(jobIndex++);
            }

            function execute(index) {
                Promise.race([jobs[index](), new Promise(reject => {
                    setTimeout(() => {
                        reject(new Error('Error!'));
                    }, timeout);
                })])
                    .then(res => finished(res, index), error => finished(error, index));
            }

            function finished(res, index) {
                result[index] = res;
                if (result.length === jobs.length) {
                    resolve(result);
                }
                if (jobIndex < jobs.length) {
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
