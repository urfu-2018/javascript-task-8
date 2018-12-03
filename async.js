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
// eslint-disable-next-line no-unused-vars
function runParallel(jobs, parallelNum, timeout = 1000) {
    if (!jobs.length || parallelNum < 1) {
        return Promise.resolve([]);
    }

    const resultTranslate = [];
    let counter = 0;
    const thrower = error => error;

    function startTranslate(anotherTranslate) {
        if (!anotherTranslate.length) {
            return;
        }

        return anotherTranslate.shift()()
            .catch(thrower)
            .then(res => {
                resultTranslate[counter] = res;
                counter++;

                startTranslate(anotherTranslate);
            });
    }

    const translates = [];

    while (parallelNum >= 0 && jobs.length !== 0) {
        translates.push(startTranslate(jobs));
        parallelNum--;
    }

    return Promise.all(translates).then(() => resultTranslate);
}

module.exports = {
    runParallel,

    isStar
};
