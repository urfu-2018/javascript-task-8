'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    const result = [];
    let curIndex = 0;
    let finishedJobs = 0;
    const length = jobs.length;

    return new Promise(resolve => {
        function getData(data) {
            result[curIndex] = data;
            curIndex++;
            finishedJobs++;
        }

        const begin = () => {
            if (finishedJobs === length) {
                resolve(result);
            }
            if (jobs.length > 0) {
                jobs.shift()()
                    .then(getData, getData)
                    .then(begin);
            }
        };

        if (length === 0 || parallelNum === 0) {
            return resolve(result);
        }

        for (let i = 0; i < jobs.length && i < parallelNum; i++) {
            begin();
        }
        setTimeout(() => finishedJobs, timeout);
    });
}

module.exports = {
    runParallel,

    isStar
};
