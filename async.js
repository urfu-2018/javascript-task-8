'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum = 1, timeout = 1000) {
    let parallelJobs = [];
    while (jobs.length > 0) {
        parallelJobs = parallelJobs.concat([jobs.splice(0, parallelNum)]);
    }

    return Promise.all(parallelJobs.map(thread =>
        Promise.all(thread.map(job => createRace(job(), timeout)))))
        .then(result => [].concat(...result));
}

function createRace(promise, timeout) {
    const timer = new Promise((resolve, reject) => {
        setTimeout(reject, timeout);
    }).catch(() => new Error ('timeout'));

    return Promise.race([promise, timer])
        .then(result => result);
}

module.exports = {
    runParallel,

    isStar
};
