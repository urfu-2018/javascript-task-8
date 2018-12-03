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
        let translations = [];
        let i = 0;
        const pushResult = (translation) => {
            translations.push(translation);
            if (translations.length === jobs.length) {
                return resolve(translations);
            }
        };
        while (i < jobs.length) {
            const arrayToExecuteParallel = groupParallel();
            executeParallel(arrayToExecuteParallel);
        }

        function groupParallel() {
            let j = 0;
            let translationPromises = [];
            while (j < parallelNum) {
                const translationPromise = jobs[i + j]();
                translationPromises.push(translationPromise);
                j++;
            }
            i += parallelNum;

            return translationPromises;
        }

        async function executeParallel(promisesGroup) {
            for (const promise of promisesGroup) {
                await Promise.race([
                    promise,
                    new Promise(reject =>
                        setTimeout(reject, timeout, new Error('Promise timeout')))
                ])
                    .then(pushResult)
                    .catch(pushResult);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
