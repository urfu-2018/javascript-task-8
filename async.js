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
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    return new Promise(resolve => {
        let results = [];
        parallelNum = Math.min(jobs.length, parallelNum);
        let lastIndex = parallelNum;

        for (let i = 0; i < parallelNum; i++) {
            runJob(i);
        }

        function runJob(index) {
            let runNextJob = result => {
                results[index] = result;
                if (results.length === jobs.length) {
                    return resolve(results);
                }
                runJob(lastIndex++);
            };

            if (index < jobs.length) {
                return Promise.race([jobs[index](), runTimer()])
                    .then(runNextJob, runNextJob);
            }
        }

        function runTimer() {
            return new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Promise timeout')), timeout);
            });
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
