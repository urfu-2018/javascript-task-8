'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @returns {Promise<Array>}
 * @param {Number} timeout - таймаут работы промиса
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    const result = [];
    let curIndex = 0;
    let finishedJobs = 0;
    if (!jobs.length || parallelNum === 0) {
        return Promise.resolve(result);
    }

    return new Promise(commonResolve => {

        const begin = () => {
            if (curIndex < jobs.length) {
                new Promise((resolve, reject) => {
                    setTimeout(() => reject(new Error('Promise timeout')), timeout);
                    jobs[curIndex]().then(resolve, reject);
                }).then(x => {
                    result[curIndex] = x;
                },
                x => {
                    result[curIndex] = x;
                })
                    .then(() => finishedJobs++)
                    .then(begin);
                curIndex++;
            }
            if (finishedJobs === jobs.length) {
                commonResolve(result);
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
