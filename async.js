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
async function runParallel(jobs, parallelNum, timeout = 1000) {
    if (jobs.length === 0) {
        return [];
    }

    const workList = [];
    const resultList = new Array(jobs.length);
    for (let i = 0; i < jobs.length; i++) {
        workList.push(i);
    }

    const workers = [];
    for (let i = 0; i < parallelNum; i++) {
        workers.push(doWork(jobs, workList, resultList, timeout));
    }

    await Promise.all(workers);

    return resultList;
}

/**
 *
 * @param {Function<Promise>[]} workSource
 * @param {Array} globalAvailableWorkIndexList
 * @param {Array} globalResultList
 * @param {Number} timeout
 * @returns {Promise}
 */
async function doWork(workSource, globalAvailableWorkIndexList, globalResultList, timeout) {
    while (globalAvailableWorkIndexList.length > 0) {
        let index = globalAvailableWorkIndexList.shift();
        if (index === undefined) {
            continue;
        }
        try {
            let work = workSource[index]();
            globalResultList[index] = await performPromiseWithTimeout(work, timeout);
        } catch (error) {
            globalResultList[index] = error;
        }
    }
}

/**
 * @param {Promise} promise
 * @param {Number} timeout
 * @returns {Promise<any | Error>}
 */
function performPromiseWithTimeout(promise, timeout) {
    return Promise.race([promise, waitAndReturnError(timeout)]);
}

/**
 * @param {Number} timeoutMillis
 * @returns {Promise<Error>}
 */
function waitAndReturnError(timeoutMillis) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(new Error('Promise timeout'));
        }, timeoutMillis);
    });
}

// noinspection JSUnresolvedVariable
module.exports = {
    runParallel,

    isStar
};
