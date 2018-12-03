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
    const promise = () => new Promise(resolve => {
        if (jobs.length === 0) {
            resolve();
        } else {
            let e = jobs.shift()().catch(x=>x);
            result.push(e);
            promise();
            resolve();
        }
    });

    for (let i = 0; i < parallelNum && i < jobs.length; i++) {
        promise();
    }

    return Promise.all(result.map(x=>x.catch(x)));
}

module.exports = {
    runParallel,

    isStar
};
