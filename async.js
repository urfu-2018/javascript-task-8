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
                resolve(translations);
            }
        };
        let allPromises = [];
        while (i < jobs.length) {
            allPromises = allPromises.concat(groupParallel());
        }
        executeParallel(allPromises);

        function groupParallel() {
            let j = 0;
            let promises = [];
            while (j < parallelNum) {
                const promise = jobs[i + j]().catch(res=>res);
                promises.push(promise);
                j++;
            }
            i += parallelNum;

            return promises;
        }

        async function executeParallel(array) {
            for (let each of array) {
                await Promise.race([
                    each,
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
