'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/**
 * Добавляет к Promise таймаут. Если таймаут закончился, то вернется reject(Error)
 * @param {Promise} promise - promise
 * @param {Number} ms - timeout
 * @returns {Promise}
 */
function promiseTimeout(promise, ms) {
    let timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Promise timeout')), ms);
    });

    return Promise.race([promise, timeoutPromise]);
}

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

    return new Promise(resolve => {
        const results = new Array(jobs.length);
        let count = Math.min(parallelNum, jobs.length);
        let finished = 0;

        for (let i = 0; i < count; i++) {
            runPromise(i);
        }

        function runPromise(num) {
            const callback = result => {
                results[num] = result;
                if (++finished === jobs.length) {
                    return resolve(results);
                }
                if (count < jobs.length) {
                    runPromise(count++);
                }
            };
            promiseTimeout(jobs[num](), timeout)
                .then(callback, callback);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
