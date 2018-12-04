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
    return new Promise(function (resolve) {
        if (!jobs.length && jobs.length === 0) {
            return resolve([]);
        }
        let translatedPhrases = [];
        let currentPhrase = 0;

        function startTranslating(indexPhrase) {
            let timeoutPromise = new Promise(reject =>
                setTimeout(reject, timeout, new Error('Promise timeout')));
            Promise.race([jobs[indexPhrase](), timeoutPromise])
                .then(current => translatingNext(current, indexPhrase))
                .catch(current => translatingNext(current, indexPhrase));
        }

        function translatingNext(phrases, indexPhrase) {
            translatedPhrases[indexPhrase] = phrases;
            if (currentPhrase < jobs.length) {
                startTranslating(currentPhrase++);
            } else if (translatedPhrases.length === jobs.length) {
                return resolve(translatedPhrases);
            }
        }

        for (let i = 0; i < parallelNum; i++) {
            startTranslating(currentPhrase++);
        }

    });
}

module.exports = {
    runParallel,

    isStar
};
