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

    if (!jobs.length || parallelNum <= 0) {
        return Promise.resolve([]);
    }

    const jobPackets = [];
    let index = 0;
    for (let i = 0; i < jobs.length; i += parallelNum) {
        jobPackets[index] = jobs.slice(i, i + parallelNum);
        index++;
    }

    return new Promise((resolve) => {
        let results = [];
        jobPackets.reduce((acc, val) => acc
            .then(() => executePacket(val))
            .then(res => {
                results = results.concat(res);
            }), Promise.resolve())
            .then(() => resolve(results));
    });
}

function executePacket(jobsPacket) {
    return Promise.all(jobsPacket.map(job => nonFailPromise(job())));
}

function nonFailPromise(promise) {
    return new Promise((resolve) => promise.then(resolve, resolve));
}

module.exports = {
    runParallel,

    isStar
};
