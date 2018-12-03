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
    console.info(parallelNum);

    return jobs.reduce((chain, job) => {
        return chain.then(chainResult =>
            createRace(job(), timeout).then(jobResult => [...chainResult, jobResult])
        );
    }, Promise.resolve([]));
}

function createRace(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((resolve, reject) => {
            setTimeout(reject, timeout);
        }).catch(() => new Error('Promise timeout'))
    ]).then(result => result, error => error);
}

module.exports = {
    runParallel,
    isStar
};
