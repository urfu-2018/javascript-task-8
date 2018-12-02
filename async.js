'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
async function runParallel(jobs, parallelNum/* timeout = 1000 */) {
    if (jobs.length === 0) {
        return [];
    }
    const result = [];
    let currentJobIndex = 0;
    const worker = async () => {
        while (result.length !== jobs.length) {
            try {
                const currentJob = jobs[currentJobIndex];
                result[currentJobIndex] = await currentJob();
            } catch (error) {
                result[currentJobIndex] = error;
            }
            currentJobIndex++;
        }
    };
    await Promise.all(new Array(parallelNum).fill(worker()));

    return result;
}

module.exports = {
    runParallel,

    isStar
};
