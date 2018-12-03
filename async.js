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
    let promise = new Promise((x) => x([]));
    if (jobs.length === 0) {
        return Promise.resolve(promise);
    }
    // асинхронная магия

    for (let i = 0; i < jobs.length; i += parallelNum) {
        promise = promise.then(result => {
            let values = jobs.splice(0, parallelNum);
            let pr = Promise.all(values.map(x => x()))
                .then(x => {
                    result.push(x);

                    return result;
                }, x => {
                    result.push(x);

                    return result;
                });

            return Promise.resolve(pr);
        });

    }

    return promise;
}

module.exports = {
    runParallel,

    isStar
};
