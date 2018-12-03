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
        let index = 0;
        const results = [];

        const runNext = (nextIndex) => {
            index ++;
            const handleEnd = (item) => {
                results[nextIndex] = item;
                if (jobs.length === results.length) {
                    resolve(results);
                } else {
                    runNext(index);
                }
            };

            new Promise((innerResolve) => {
                const nextJob = jobs[nextIndex];
                withTimeout(nextJob(), timeout).then(innerResolve, innerResolve);
            }).then(handleEnd);
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

module.exports = {
    runParallel,

    isStar
};
