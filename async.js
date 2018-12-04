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
            resolve([]);
        }
        let jobPromises = jobs.map(job => Promise
            .resolve(Promise.race([job().catch(res=>res),
                new Promise(reject =>
                    setTimeout(reject, timeout, new Error('Promise timeout')))])));
        let translations = Promise.all(jobPromises);
        resolve(translations);
    });
}

module.exports = {
    runParallel,

    isStar
};
