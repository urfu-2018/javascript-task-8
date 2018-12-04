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
    if (!jobs.length || parallelNum <= 0) {
        return Promise.resolve([]);
    }

    const resultTranslate = [];
    let counter = 0;
    const thrower = error => error;

    function startTranslate(anotherTranslate) {
        if (!anotherTranslate.length) {
            return;
        }

        return Promise.race([
            new Promise(resolve => setTimeout(resolve, timeout, new Error('Promise timeout'))),
            anotherTranslate.shift()().catch(thrower)
        ]).then(res => {
            resultTranslate[counter] = res;
            counter++;

            return startTranslate(anotherTranslate);
        });
    }

    const translates = [];

    while (parallelNum > 0 && jobs.length !== 0) {
        translates.push(startTranslate(jobs));
        parallelNum--;
    }

    return Promise.all(translates).then(() => resultTranslate);
}

module.exports = {
    runParallel,

    isStar
};
