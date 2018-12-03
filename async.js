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

    return new Promise(resolve => {
        const result = [];
        if (!jobs.length) {
            resolve(result);
        }

        async function begin(index) {
            if (index >= jobs.length) {
                resolve(result);
            } else {
                result[index] = await jobs[index]()
                    .catch(x => x);
                begin(index + 1);
            }
        }

        for (let i = 0; i < parallelNum && i < jobs.length; i++) {
            begin(i);
        }
    });

}

module.exports = {
    runParallel,

    isStar
};
