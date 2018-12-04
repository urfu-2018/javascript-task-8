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
    const lenght = jobs.length;
    if (jobs.length === 0 || parallelNum === 0) {
        return Promise.resolve(result);
    }

    function getData(data) {
        result[curIndex] = data;
        curIndex++;
    }

    return new Promise(resolve => {

        const begin = () => {
            if (finishedJobs === lenght) {
                resolve(result);
            }
            if (jobs.length > 0) {
                jobs.shift()()
                    .then(getData, getData)
                    .then(() => finishedJobs++)
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
