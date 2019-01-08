'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;
let lastStartedIndex = 0;

function executeJob(jobIndex, resolve, results, jobs) {
    let job = jobs[jobIndex];
    job()
        .then(x => exitJob({ 'result': x, 'index': jobIndex },
            resolve, results, jobs))
        .catch(x => exitJob({ 'result': x, 'index': jobIndex },
            resolve, results, jobs));
}

function exitJob(resultObject, resolve, results, jobs) {
    results[resultObject.index] = resultObject.result;
    if (results.length === jobs.length) {
        resolve(results);

        return;
    }

    if (lastStartedIndex < jobs.length) {
        executeJob(lastStartedIndex++, resolve, results, jobs);
    }
}

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 *  @param {Number} timeout - таймаут
 * @returns {Promise<Array>}
 */
async function runParallel(jobs, parallelNum) {
    return new Promise(resolve => {
        const results = [];

        if (jobs.length === 0) {
            resolve([]);
        }

        while (lastStartedIndex < parallelNum) {
            executeJob(lastStartedIndex++, resolve, results, jobs);
        }
    });

}

module.exports = {
    runParallel,
    isStar
};
