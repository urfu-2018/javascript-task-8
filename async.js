'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 */

function runParallel(jobs, parallelNum, timeout = 1000) {
    // асинхронная магия
    return new Promise(resolve => {
        let results = [];
        let count = 0;
        if (jobs.length === 0) {
            resolve([]);
        }

        for (let i = 0; i < parallelNum; i++) {
            runJobs(jobs[count], count);
            count += 1;
        }

        function runJobs(job, index) {
            const promiseTimeout = currentResult => {
                results[index] = currentResult;
                if (results.length === jobs.length) {
                    resolve(results);
                }
                if (count < jobs.length) {
                    runJobs(jobs[count], count);
                    count += 1;
                }
            };

            Promise
                .race([job(), new Promise((res, rej) =>
                    setTimeout(rej, timeout, new Error('Promise timeout')))])
                .then(promiseTimeout, promiseTimeout);
        }
    });
}
