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
        if (!jobs.length) {
            return resolve([]);
        }
        const result = [];
        let currentIndex = 0;
        const count = Math.min(parallelNum, jobs.length);
        for (let i = 0; i < count; i++) {
            doJob(currentIndex++);
        }

        async function doJob(index) {
            const job = jobs[index];
            const promiseTimer = new Promise(reject => {
                setTimeout(reject, timeout, new Error('Promise timeout'));
            });
            result[index] = await Promise.race([job(), promiseTimer]).then(res => res, err => err);
            if (currentIndex === jobs.length) {
                return resolve(result);
            }
            doJob(currentIndex++);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
