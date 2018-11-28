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
async function runParallel(jobs, parallelNum) {
    return new Promise(resolve => {
        const results = [];
        let lastStartedIndex = 0;

        if (jobs.length === 0) {
            resolve([]);

            return;
        }

        function runJob(jobIndex) {
            let job = jobs[jobIndex];
            Promise.resolve(job())
                .then(x => saveResultAndTakeNext(x, jobIndex))
                .catch(x => saveResultAndTakeNext(x, jobIndex));
        }

        function saveResultAndTakeNext(result, index) {
            results[index] = result;
            if (results.length === jobs.length) {
                resolve(results);

                return;
            }
            if (lastStartedIndex < jobs.length) {
                runJob(lastStartedIndex++);
            }
        }

        while (lastStartedIndex < parallelNum) {
            runJob(lastStartedIndex++)
        }
    });

}

module.exports = {
    runParallel,

    isStar
};
