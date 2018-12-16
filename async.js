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
        return new Promise(resolve => resolve([]));
    }

    let state = {
        cancelled: false
    };

    return runWithTimeout(_runParallel(jobs, parallelNum, state), state, timeout);
}

function _runParallel(jobs, parallelNum, state) {
    return new Promise(resolve => {
        let results = [];
        let index = 0;

        function runNext() {
            const current = index++;

            if (state.cancelled || current >= jobs.length) {
                return resolve(results);
            }

            jobs[current]()
                .then(r => {
                    results[current] = r;
                    runNext();
                })
                .catch(r => {
                    results[current] = r;
                    runNext();
                });
        }

        for (let i = 0; i < Math.min(parallelNum, jobs.length); ++i) {
            runNext();
        }
    });
}

function runWithTimeout(job, state, timeout) {
    return Promise.race([job, timeoutPromise(state, timeout)]);
}

function timeoutPromise(state, timeout) {
    return new Promise(
        (resolve, reject) => setTimeout(() => {
            state.cancelled = true;
            reject(new Error('Promise timeout'));
        }, timeout));
}

module.exports = {
    runParallel,

    isStar
};
