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
    return new Promise((resolve) => {
        if (jobs.length === 0) {
            return resolve([]);
        }
        let result = [];
        let id = 0;
        for (let i = 0; i < Math.min(parallelNum, jobs.length); i++) {
            runJob(id++);
        }

        async function runJob(index) {
            const job = jobs[index]();
            const promiseTimeout = new Promise(reject =>
                setTimeout(reject, timeout, new Error('Promise timeout')));
            result[index] = await Promise
                .race([job, promiseTimeout])
                .then(res => res, res => res);
            if (result.length === jobs.length) {
                resolve(result);
            } else {
                runJob(id++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
