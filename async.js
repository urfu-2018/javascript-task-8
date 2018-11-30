'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

const ERROR = new Error('Promise timeout');

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    let jobPointer = 0;
    let jobsLeft = jobs.length;
    const resultArray = [];

    return new Promise(resolve => {
        if (!jobs.length) {
            resolve([]);

            return;
        }
        const limit = jobs.length < parallelNum ? jobs.length : parallelNum;

        for (; jobPointer < limit; jobPointer++) {
            startJob(jobs[jobPointer], jobPointer, timeout);
        }

        function startJob(promiseFunc, jobIndex) {
            let id;

            return Promise.race([
                promiseFunc(),
                new Promise((res, reject) => {
                    id = setTimeout(() => {
                        reject(ERROR);
                    }, timeout);
                })
            ]).then(result => {
                clearTimeout(id);
                resultArray[jobIndex] = result;

                return startNextJob();
            })
                .catch(error => {
                    clearTimeout(id);
                    resultArray[jobIndex] = error;

                    return startNextJob();
                });
        }

        function startNextJob() {
            jobsLeft--;
            if (jobsLeft === 0) {
                resolve(resultArray);

                return;
            }

            if (jobPointer < jobs.length) {
                startJob(jobs[jobPointer], jobPointer);
                jobPointer++;
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
