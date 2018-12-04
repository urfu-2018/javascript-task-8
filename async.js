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

    const queue = [];
    for (let i = 0; i < jobs.length; i++) {
        queue.push(jobs[i]);
    }

    const result = [];
    const count = Math.min(jobs.length, parallelNum);

    const workers = [];
    for (let i = 0; i < count; i++) {
        workers.push(doWork(queue, result, timeout));
    }

    await Promise.all(workers);

    return result;
}

async function doWork(queue, result, timeout) {
    while (queue.length > 0) {
        const item = queue.shift();

        if (item === undefined) {
            continue;
        }

        await Promise.race([item(), startTimer(timeout)])
            .then(res => result.push(res), res => result.push(res));
    }
}

function startTimer(timeout) {
    return new Promise((then, reject) => {
        setTimeout(() => {
            reject(new Error('Promise timeout'));
        }, timeout);
    });
}

module.exports = {
    runParallel,

    isStar
};
