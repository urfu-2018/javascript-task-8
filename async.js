'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum) {
    const result = [];
    let currentJobIndex = 0;
    let finishedJobsCount = 0;

    return new Promise(resolve => {
        if (jobs.length === 0 || parallelNum === 0) {
            resolve(result);
        }
        const begin = () => {
            if (finishedJobsCount >= jobs.length) {
                resolve(result);
            }
            if (currentJobIndex < jobs.length) {
                currentJobIndex++;
                jobs[currentJobIndex - 1]()
                    .then(x => {
                        result[currentJobIndex - 1] = x;
                    },
                    x => {
                        result[currentJobIndex - 1] = x;
                    })
                    .then(() => finishedJobsCount++)
                    .then(begin);
            }
        };

        for (let i = 0; i < jobs.length && i < parallelNum; i++) {
            begin();
        }

    });
}

module.exports = {
    runParallel,

    isStar
};
