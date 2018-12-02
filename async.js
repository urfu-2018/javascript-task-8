'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

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
        let tmpIndex = 0;
        let c = Math.min(jobs.length, parallelNum);
        for (let i = 0; i < c; i++) {
            doSomething(tmpIndex++);
        }

        async function doSomething(index) {
            const job = jobs[index];
            const timer = new Promise(reject => {
                setTimeout(reject, timeout);
            });
            result[index] = await Promise.race([job(), timer]).then(resol => resol, err => err);
            if (result.length === jobs.length) {
                resolve(result);
            }
            if (jobs.length > result.length) {
                doSomething(tmpIndex++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
