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
function runParallel(jobs, parallelNum = 1, timeout = 1000) {
    let parallelJobs = [];
    while (jobs.length > 0) {
        parallelJobs = parallelJobs.concat([jobs.splice(0, parallelNum)]);
    }

    let megaResult = [];
    for (const chunk of parallelJobs) {
        megaResult.push(chunk.reduce((chain, job) => {
            return chain.then(chainResult =>
                createRace(job(), timeout)
                    .then(jobResult => [...chainResult, jobResult])
                    .catch(err => [...chainResult, err])
            );
        }, Promise.resolve([])));
    }

    return Promise.all(megaResult).then(res => [].concat(...res));
}

function createRace(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((resolve, reject) => {
            setTimeout(reject, timeout);
        }).catch(() => new Error('Promise timeout'))
    ]).then(result => result, error => error);
}

module.exports = {
    runParallel,
    isStar
};
