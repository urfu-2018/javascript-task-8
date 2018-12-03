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
        const result = [];
        if (!jobs.length) {
            resolve(result);
        }
        let currentJobIndex = 0;
        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            runCurrentJob();
            currentJobIndex++;
        }

        async function runCurrentJob() {
            const timeoutPromise = new Promise(reject => {
                setTimeout(reject, timeout, new Error('Promise timeout'));
            });
            result[currentJobIndex] = await Promise.race([jobs[currentJobIndex](), timeoutPromise]);
            if (result.length === jobs.length) {
                resolve(result);
            }
            if (jobs.length > result.length) {
                runCurrentJob();
                currentJobIndex++;
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
