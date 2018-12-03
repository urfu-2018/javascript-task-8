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
    let index = 0;

    return new Promise(resolve => {
        const begin = () => {
            if (index >= jobs.length) {
                resolve(result);
            } else {
                jobs[index]()
                    .then(y => {
                        result[index] = y;
                    },
                    y => {
                        result[index] = y;
                    })
                    .then(() => {
                        index++;
                    })
                    .then(begin);
            }
        };

        for (let i = 0; i < parallelNum && i < jobs.length; i++) {
            begin();
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
