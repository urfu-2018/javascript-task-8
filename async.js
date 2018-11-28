'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 *  @param {Number} timeout - таймаут
 * @returns {Promise<Array>}
 */
async function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        const results = [];
        let lastStartedIndex = 0;

        if (jobs.length === 0) {
            resolve([]);

            return;
        }

        function runJob(jobIndex) {
            let job = jobs[jobIndex];
            Promise.race([
                job(),
                new Promise(rejected => setTimeout(rejected, timeout, new Error('Promise timeout')))
            ])
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
            runJob(lastStartedIndex++);
        }
    });

}

module.exports = {
    runParallel,

    isStar
};
