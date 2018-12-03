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

        while (currentIndex < parallelNum) {
            doJob(currentIndex++);
        }

        async function doJob(jobIndex) {
            await executeWithTimeout(doneJobs, jobs[jobIndex], jobIndex, timeout);

            if (doneJobs.length === jobs.length) {
                resolve(doneJobs);
            }

            if (currentIndex < jobs.length) {
                doJob(currentIndex++);
            }
        }
    });
}

async function executeWithTimeout(doneJobs, currentJob, index, timeout) {
    const timeoutPromise = new Promise((resolve, reject) =>
        setTimeout(() => reject(new Error('Promise timeout')), timeout)
    );

    doneJobs[index] = Promise
        .race([await currentJob(), timeoutPromise])
        .then(resolve => resolve, reject => reject);
}

module.exports = {
    runParallel,

    isStar
};
