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
            const promiseTimeout = currentResult => endOfWork(currentResult, index);

            Promise
                .race([job(), new Promise((resolve, reject) =>
                    setTimeout(reject, timeout, new Error('Promise timeout')))])
                .then(promiseTimeout, promiseTimeout);
        }

        function endOfWork(result, index) {
            results[index] = result;
            if (results.length === jobs.length) {
                resolve(results);
            }
            if (count < jobs.length) {
                runJobs(jobs[count], count);
                count += 1;
            }
        }
    });
}
