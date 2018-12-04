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
        const pushResult = (translation, index) => {
            translations[index] = translation;
            if (translations.length === jobs.length) {
                resolve(translations);
            }
        };
        while (i < jobs.length) {
            groupParallel();
        }

        function groupParallel() {
            let j = 0;
            while (j < parallelNum) {
                const promise = jobs[i + j]().catch(res=>res);
                executeParallel(promise, i + j);
                j++;
            }
            i += parallelNum;
        }

        function executeParallel(promise, index) {
            Promise.race([
                promise,
                new Promise(reject =>
                    setTimeout(reject, timeout, new Error('Promise timeout')))
            ])
                .then(res => pushResult(res, index))
                .catch(res => pushResult(res, index));
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
