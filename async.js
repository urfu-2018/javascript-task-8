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
    if (jobs.length === 0) {
        return Promise.resolve(result);
    }
    let index = 0;
    const promise = i => new Promise(resolve => {
        if (index >= jobs.length) {
            resolve();
        } else {
            result[i] = jobs[i]()
                .catch(x => x);
            promise(++index);
            resolve();
        }
    });

    for (let i = 0; i < parallelNum && i < jobs.length; i++) {
        promise(i);
        index++;
    }

    return Promise.all(result);
}

module.exports = {
    runParallel,

    isStar
};
