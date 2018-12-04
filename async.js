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

    return new Promise((resolve) => {
        if (jobs.length === 0) {
            resolve([]);
        }
        let translations = [];
        let curIndex = 0;
        executeNextJob(curIndex++);

        async function executeNextJob(index) {
            const promise = jobs[index]();

            translations[index] = await Promise.race([
                promise,
                new Promise(reject =>
                    setTimeout(reject, timeout, new Error('Promise timeout')))
            ])
                .then(res => res)
                .catch(res => res);
            if (translations.length === jobs.length) {
                resolve(translations);
            } else {
                executeNextJob(curIndex++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
