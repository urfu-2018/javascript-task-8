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
        return Promise.resolve(jobs);
    }

    return new Promise(resolve => {
        const results = [];
        let lastJobStartedIndex = 0;

        function run(jobIndex) {
            const job = jobs[jobIndex];
            Promise.race([
                job(),
                new Promise(rejected => setTimeout(rejected, timeout, new Error('Promise timeout')))
            ])
                .then(result => saveResultAndRunNext(result, jobIndex))
                .catch(result => saveResultAndRunNext(result, jobIndex));
        }

        function saveResultAndRunNext(result, jobIndex) {
            results[jobIndex] = result;
            runNext(jobIndex);
        }

        function runNext(jobIndex) {
            if (results.length === jobs.length) {
                return resolve(results);
            }
            if (jobIndex < jobs.length) {
                run(lastJobStartedIndex++);
            }
        }

        while (lastJobStartedIndex < parallelNum) {
            run(lastJobStartedIndex++);
        }
    }
    );
}

module.exports = {
    runParallel,

    isStar
};
