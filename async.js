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
            let count += 1;
            runJobsFunction(jobs[count - 1], count - 1);
        }

        function runJobsFunction(job, index) {
            const final = currentResult => endOfWork(currentResult, index);

            Promise.race([job(), new Promise((resolveForError) =>
                setTimeout(resolveForError, timeout, new Error()))])
                .then(final,final);
        }

        function endOfWork(result, index) {
            results[index] = result;
            if (results.length === jobs.length) {
                resolve(results);
            }
            if (count < jobs.length) {
                count += 1;
                runJobsFunction(jobs[count - 1], count - 1);
            }
        }
    });
}
