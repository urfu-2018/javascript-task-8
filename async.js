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

    parallelNum = Math.min(parallelNum, jobs.length);

    const result = [];
    let currentJobIndex = 0;

    const doJob = async (jobIndex) => {
        const job = jobs[jobIndex];
        try {
            result[jobIndex] = await runWithTimeout(job, timeout);
        } catch (error) {
            result[jobIndex] = error;
        }

        if (result.length === jobs.length) {
            return;
        }

        if (currentJobIndex < jobs.length) {
            await doJob(currentJobIndex++);
        }
    };

    const asyncJobs = [];
    for (let i = 0; i < parallelNum; i++) {
        asyncJobs.push(doJob(currentJobIndex++));
    }

    await Promise.all(asyncJobs);

    return result;
}

function runWithTimeout(job, timeout) {
    const timer = new Promise(resolve => {
        setTimeout(resolve, timeout, new Error('Promise timeout'));
    });

    return Promise.race([
        job(),
        timer
    ]);
}

module.exports = {
    runParallel,

    isStar
};
