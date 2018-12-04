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

    const indexesQueue = [];
    for (let i = 0; i < jobs.length; i++) {
        indexesQueue.push(i);
    }

    const result = new Array(jobs.length);
    const count = Math.min(jobs.length, parallelNum);

    const workers = [];
    for (let i = 0; i < count; i++) {
        workers.push(doWork(indexesQueue, jobs, result, timeout));
    }

    await Promise.all(workers);

    return result;
}

async function doWork(indexesQueue, jobs, result, timeout) {
    while (indexesQueue.length > 0) {
        let index = indexesQueue.shift();

        if (index === undefined) {
            continue;
        }

        await Promise.race([jobs[index](), startTimer(timeout)])
            .then(res => {
                result[index] = res;
            }, res => {
                result[index] = res;
            });
    }
}

async function startTimer(timeout) {
    return await new Promise((then, reject) => {
        setTimeout(() => {
            reject(new Error('Promise timeout'));
        }, timeout);
    });
}

module.exports = {
    runParallel,

    isStar
};
