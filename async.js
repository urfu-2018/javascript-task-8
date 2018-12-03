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
    if (!jobs.length || parallelNum === 0) {
        return Promise.resolve(result);
    }
    return new Promise(resolve => {

        const begin = () => {
            if (finishedJobsCount >= jobs.length) {
                resolve(result);
            }
            if (currentJobIndex < jobs.length) {
                jobs[currentJobIndex]()
                    .then(x => {
                        result[currentJobIndex] = x;
                    },
                    x => {
                        result[currentJobIndex] = x;
                    })
                    .then(() => finishedJobsCount++)
                    .then(begin);
                currentJobIndex++;
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
