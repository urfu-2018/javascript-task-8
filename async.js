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
function runParallel(jobs, parallelNum, timeout = 1000) {
    // асинхронная магия

    if (!jobs.length || parallelNum <= 0) {
        return Promise.resolve([]);
    }

    const jobPackets = [];
    for (let i = 0; i < jobs.length; i += parallelNum) {
        jobPackets.push(jobs.slice(i, i + parallelNum));
    }

    let results = [];

    return jobPackets.reduce((acc, val) => acc
        .then(() => executePacket(val, timeout))
        .then(res => {
            results = results.concat(res);
        }), Promise.resolve())
        .then(() => Promise.resolve(results));
}

function executePacket(jobsPacket, timeout) {
    return Promise.all(jobsPacket.map(job => nonFailPromise(timeoutPromise(job(), timeout))));
}

function timeoutPromise(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((resolve, reject) => {
            setTimeout(reject, timeout, new Error('Promise timeout'));
        })
    ]);
}

function nonFailPromise(promise) {
    return new Promise((resolve) => promise.then(resolve, resolve));
}

module.exports = {
    runParallel,

    isStar
};
