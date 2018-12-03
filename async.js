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
    let jobPointer = 0;
    let jobsLeft = jobs.length;
    const resultArray = [];

    return new Promise(resolve => {
        if (!jobs.length) {
            resolve([]);

            return;
        }
        const limit = Math.min(parallelNum, jobs.length);

        for (; jobPointer < limit; jobPointer++) {
            startJob(jobPointer);
        }

        function startJob(jobIndex) {
            let id;

            startPromiseWithTimeout(jobs[jobIndex](), timeout)
                .then(result => startNextJob(id, result, jobIndex))
                .catch(error => startNextJob(id, error, jobIndex));

            function startPromiseWithTimeout(promise) {
                return Promise.race([
                    promise,
                    new Promise((res, reject) => {
                        id = setTimeout(() => {
                            reject(new Error('Promise timeout'));
                        }, timeout);
                    })
                ]);
            }
        }

        function startNextJob(timeoutId, result, jobIndex) {
            clearTimeout(timeoutId);
            resultArray[jobIndex] = result;
            jobsLeft--;

            if (jobsLeft === 0) {
                resolve(resultArray);

                return;
            }

            if (jobPointer < jobs.length) {
                startJob(jobPointer++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
