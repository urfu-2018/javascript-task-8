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
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    return new Promise((resolve) => {
        const results = [];
        let nextJobIndex = 0;

        const runNext = () => {
            const ownIndex = nextJobIndex++;

            const handleEnd = (item) => {
                results[ownIndex] = item;

                if (results.length >= jobs.length) {
                    resolve(results);
                } else {
                    runNext();
                }
            };

            const nextJob = jobs[ownIndex];

            preventFail(withTimeout(nextJob(), timeout)).then(handleEnd);
        };

        for (let i = 0; i < Math.min(parallelNum, jobs.length); i++) {
            runNext(i);
        }
    });
}

function withTimeout(promise, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, timeout, new Error('Promise timeout'));
        promise.then(resolve, reject);
    });
}

function preventFail(promise) {
    return new Promise(resolve => {
        promise.then(resolve).catch(resolve);
    });
}

module.exports = {
    runParallel,

    isStar
};
