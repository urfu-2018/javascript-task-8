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
function runParallel(jobs, parallelNum) {
    // асинхронная магия

    let jobsArray = [];
    let index = 0;
    for (let i = 0; i < jobs.length; i += parallelNum) {
        jobsArray[index] = jobs.slice(i, i + parallelNum);
        index++;
    }

    return Promise.all(jobsArray.map(jobsPacket =>
        Promise.all(jobsPacket.map(job => nonFailPromise(job())))))
        .then(results => [].concat(...results));
}

function nonFailPromise(promise) {
    return new Promise((resolve) => promise.then(resolve, resolve));
}

module.exports = {
    runParallel,

    isStar
};
