/* eslint-disable linebreak-style */
'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/**
 * Добавляет к Promise таймаут. Если таймаутзакончился, то вернется resolve(Error)
 * @param {Number} ms - timeout
 * @param {Promise} promise - promise
 * @returns {Promise}
 */
function promiseTimeout(ms, promise) {
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error('Promise timeout'));
        }, ms);
    });

    return Promise.race([promise, timeout]);
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
        let finished = 0;
        let count = 0;

        for (count = 0; count < Math.min(parallelNum, jobs.length); count++) {
            runPromise(count);
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
            promiseTimeout(timeout, jobs[num]())
                .then(callback, callback);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
