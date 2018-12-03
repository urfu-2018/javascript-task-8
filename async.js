'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

function runWithTimeout(promise, timeout) {
    return Promise.race([promise(), errorAfterTimeout(timeout)]);
}

async function errorAfterTimeout(timeout) {
    return await new Promise(resolve =>
        setTimeout(() => resolve(new Error('Promise timeout')), timeout)
    );
}

async function execute(jobs, jobTaskIds, jobResults, timeout) {
    while (jobTaskIds.length > 0) {
        const id = jobTaskIds.shift();
        if (id === undefined) {
            break;
        }
        try {
            jobResults[id] = await runWithTimeout(jobs[id], timeout);
        } catch (error) {
            jobResults[id] = error;
        }
    }
}

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
async function runParallel(jobs, parallelNum, timeout = 1000) {
    // асинхронная магия
    if (jobs.length === 0) {
        return [];
    }
    const jobTaskIds = [];
    let jobResults = new Array(jobs.length);
    const workers = [];
    for (let i = 0; i < jobs.length; ++i) {
        jobTaskIds.push(i);
    }
    for (let i = 0; i < parallelNum; ++i) {
        workers.push(execute(jobs, jobTaskIds, jobResults, timeout));
    }
    await Promise.all(workers);

    return jobResults;
}


module.exports = {
    runParallel,

    isStar
};
