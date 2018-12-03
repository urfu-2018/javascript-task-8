'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

async function workerFunction(jobs, jobTimeout) {
    const workerResult = [];
    while (jobs.length > 0) {
        const job = jobs.pop();
        const jobIndex = jobs.length;
        try {
            const result = await setPromiseTimeout(job(), jobTimeout);
            workerResult.push([result, jobIndex]);
        } catch (error) {
            workerResult.push([error, jobIndex]);
        }
    }

    return workerResult;
}

function setPromiseTimeout(promise, timeout) {
    return new Promise((resolve, reject) => {
        const timeoutID = setTimeout(() => reject(new Error('Promise timeout')), timeout);
        promise
            .then(result => {
                clearTimeout(timeoutID);
                resolve(result);
            });
    });
}

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
async function runParallel(jobs, parallelNum, timeout = 1000) {
    if (jobs.length === 0) {
        return [];
    }

    const totalResult = [];
    const workers = [];
    jobs.reverse();
    for (let i = 0; i < parallelNum; i++) {
        workers.push(workerFunction(jobs, timeout));
    }

    const workersResult = await Promise.all(workers);
    workersResult.forEach(resultArray => {
        resultArray.forEach(([result, jobIndex]) => {
            totalResult[jobIndex] = result;
        });
    });
    totalResult.reverse();

    return totalResult;
}

module.exports = {
    runParallel,
    isStar
};
