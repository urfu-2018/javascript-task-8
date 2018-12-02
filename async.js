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
    return new Promise(resolve => {
        if (!jobs.length) {
            resolve([]);
        }
        const result = [];
        let currentIndex = 0;
        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            runJob(currentIndex++);
        }

        async function runJob(index) {
            const job = jobs[index];
            const timer = new Promise(reject => {
                setTimeout(reject, timeout, new Error('Promise timeout'));
            });
            result[index] = await Promise.race([job(), timer]);
            if (result.length === jobs.length) {
                resolve(result);
            }
            if (jobs.length > result.length) {
                runJob(currentIndex++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
