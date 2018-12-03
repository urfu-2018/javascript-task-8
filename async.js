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
            return resolve([]);
        }
        let jobPointer = 0;
        let runningJobs = [];
        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            run(jobPointer++);
        }

        function run(jobIndex) {
            const finishCallback = currentResult => {
                runningJobs[jobIndex] = currentResult;
                if (runningJobs.length === jobs.length) {
                    return resolve(runningJobs);
                }
                if (jobPointer < jobs.length) {
                    run(jobPointer++);
                }
            };

            raceJobs(finishCallback, jobIndex);
        }

        function raceJobs(currentResult, jobIndex) {
            Promise.race([
                jobs[jobIndex](),
                new Promise((_, reject) => setTimeout(reject, timeout))
            ]).then(currentResult, currentResult);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
