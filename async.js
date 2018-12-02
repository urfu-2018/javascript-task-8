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
    if (!(jobs && jobs.length)) {
        return Promise.resolve([]);
    }

    return new Promise((resolve) => {
        var index = 0;
        const translatedWordsArray = [];
        const requestQueue = (RequestQueueIndex) => {
            const makeTranslation = (item) => {
                translatedWordsArray[RequestQueueIndex] = item;
                if (jobs.length === translatedWordsArray.length) {
                    resolve(translatedWordsArray);
                } else {
                    requestQueue(++index);
                }
            };
            new Promise((resolverTimeout) => {
                setTimeout(resolverTimeout, timeout, new Error('Promise timeout'));
                jobs[RequestQueueIndex]().then(resolverTimeout)
                    .catch(resolverTimeout);
            })
                .then(makeTranslation);
        };
        for (var i = 0; i < Math.min(parallelNum, jobs.length); i++) {
            requestQueue(i);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
