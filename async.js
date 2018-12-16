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
    return new Promise(resolve => {
        if (jobs.length === 0) {
            resolve([]);
        }

        let results = [];
        let index = 0;
        let running = 0;

        function runNext() {
            const current = index++;

            if (running === 0 && current >= jobs.length) {
                return resolve(results);
            }

            if (current >= jobs.length) {
                return;
            }

            running++;

            function continuation(r) {
                results[current] = r;
                --running;
                runNext();
            }

            runWithTimeout(jobs[current](), timeout)
                .then(continuation)
                .catch(continuation);
        }

        for (let i = 0; i < Math.min(parallelNum, jobs.length); ++i) {
            runNext();
        }
    });
}

/** Функция ждёт промис указанный таймаут
 * @param {Promise} job – промис
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */
function runWithTimeout(job, timeout) {
    return Promise.race([job, timeoutPromise(timeout)]);
}

/** Функция, возвращающая промис, завершающийся с ошибкой через timeout миллисекунд
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */
function timeoutPromise(timeout) {
    return new Promise(
        (resolve, reject) => setTimeout(() => reject(new Error('Promise timeout')), timeout));
}

module.exports = {
    runParallel,

    isStar
};
