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
    let curIndex = 0;
    let finishedJobs = 0;
    if (!jobs.length) {
        return Promise.resolve(result);
    }

    function getData(data) {
        result[curIndex] = data;
    }

    return new Promise(resolve => {

        const begin = () => {
            if (!jobs.length) {
                resolve(result);
            } else {
                let promiseFunction = jobs.shift();
                promiseFunction()
                    .then(getData, getData)
                    .then(() => finishedJobs++)
                    .then(begin);
                curIndex++;
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
