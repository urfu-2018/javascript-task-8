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
    if (!jobs || jobs.length === 0) {
        return Promise.resolve([]);
    }

    return new Promise(resolve => {
        const count = Math.min(jobs.length, parallelNum);
        let translations = [];
        let jobIndex = 0;

        const translate = id => {
            const addTranslation = translation => {
                translations[id] = translation;
                if (translations.length !== jobs.length) {
                    translate(jobIndex++);
                } else {
                    return resolve(translations);
                }
            };
            const promise = new Promise(resolver => {
                setTimeout(resolver, timeout, new Error('Promise timeout'));
                jobs[id]().then(resolver)
                    .catch(resolver);
            });

            return promise.then(addTranslation);
        };

        while (jobIndex < count) {
            translate(jobIndex++);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
