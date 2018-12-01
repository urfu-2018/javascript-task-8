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

    return new Promise(resolve => {
        resolve(Promise.all(parallelJobs.map(async thread => await Promise.all(thread.map(job =>
            createRace(job(), timeout))))).then(result => [].concat(...result)));
    });
}

function createRace(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((resolve, reject) => setTimeout(reject, timeout))
    ]).then(result => result, () => new Error('Promise timeout'));
}

module.exports = {
    runParallel,
    isStar
};
