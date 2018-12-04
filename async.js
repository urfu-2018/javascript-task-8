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
    return new Promise(function (resolve) {
        if (jobs.length === 0 || typeof jobs === 'undefined') {
            return resolve([]);
        }

        let currentIndex = 0;

        const resultArray = [];

        function react(response, index) {
            if (currentIndex < jobs.length) {
                adjustTimeOutAndReact(currentIndex++);
            }

            resultArray[index] = response;

            if (resultArray.length === jobs.length) {
                return resolve(resultArray);
            }
        }
        function adjustTimeOutAndReact(index) {
            const timeOut = new Promise(function (resolve1, reject1) {
                return setTimeout(reject1, timeout, new Error('Promise timeout'));
            });

            Promise.race([jobs[index](), timeOut])
                .then(res => {
                    react(res, index);
                })
                .catch(err => {
                    react(err, index);
                });
        }

        for (let i = 0; i < jobs.length && parallelNum > 0; i++, parallelNum--) {
            adjustTimeOutAndReact(currentIndex++);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
