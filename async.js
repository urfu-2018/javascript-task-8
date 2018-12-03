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
    return new Promise(resolve => {
        if (jobs.length === 0) {
            resolve([]);
        }

        const doneJobs = [];
        let currentIndex = 0;
        const doJob = async jobIndex => {
            doneJobs[jobIndex] = await executeWithTimeout(jobs[jobIndex], timeout);

            if (doneJobs.length === jobs.length) {
                resolve(doneJobs);
            }

            if (currentIndex < jobs.length) {
                doJob(currentIndex++);
            }
        };

        while (currentIndex < parallelNum) {
            doJob(currentIndex++);
        }
    });
}

function executeWithTimeout(currentJob, timeout) {
    const timeoutPromise = new Promise((resolve, reject) =>
        setTimeout(reject, timeout, new Error('Promise timeout'))
    );

    return Promise
        .race([currentJob(), timeoutPromise])
        .then(resolve => resolve, reject => reject);
}

module.exports = {
    runParallel,

    isStar
};
