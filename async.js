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
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    let results = [];
    let indexOfJob = 0;

    return new Promise(
        resolve => {
            function makeResult(currentIndex, result) {
                results[currentIndex] = result;
                if (currentIndex === jobs.length) {
                    return resolve(results);
                }
                if (indexOfJob < jobs.length) {
                    doJob(indexOfJob++);
                }
            }

            function doJob(currentIndex) {
                let runningJob = jobs[currentIndex]();
                let timeOutJob = new Promise(reject =>
                    setTimeout(reject, timeout, new Error('Promise timeout')));

                Promise
                    .race([runningJob, timeOutJob])
                    .then(result => makeResult(currentIndex, result))
                    .catch(error => makeResult(currentIndex, error));
            }

            while (indexOfJob < parallelNum) {
                doJob(indexOfJob++);
            }
        }
    );
}

module.exports = {
    runParallel,

    isStar
};
