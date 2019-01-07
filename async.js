'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum) {
    let jobId = 0;
    const responses = [];
    const promiseChains = [];

    function chain() {
        const nextJob = jobs.shift();

        if (!nextJob) {
            return;
        }

        const currentJobId = jobId++;

        return nextJob()
            .then(data => {
                responses[currentJobId] = data;

                return chain();
            })
            .catch(error => {
                responses[currentJobId] = error;

                return chain();
            });
    }

    let chainsCount = Math.min(parallelNum, jobs.length);
    while (chainsCount) {
        promiseChains.push(chain());
        chainsCount--;
    }

    return Promise.all(promiseChains).then(() => responses);
}

module.exports = {
    runParallel,

    isStar
};
