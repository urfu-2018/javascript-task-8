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
    if (!jobs.length) {
        return [];
    }

    jobs = jobs.map((job, id) => ({ id, job }));
    let results = Array(jobs.length);
    let workers = [];
    let workersCount = Math.min(jobs.length, parallelNum);

    for (let i = 0; i < workersCount; i++) {
        workers.push(work(jobs, results, timeout));
    }

    await Promise.all(workers);

    return results;
}

async function work(jobs, results, timeout) {
    while (jobs.length) {
        let job = jobs.shift();

        try {
            let data = await Promise.race([job.job(), delay(timeout)]);
            results[job.id] = data;
        } catch (error) {
            results[job.id] = error;
        }
    }
}

function delay(timeout) {
    return new Promise((then, reject) =>
        setTimeout(() => reject(new Error('Promise timeout')), timeout));
}

module.exports = {
    runParallel,

    isStar
};
