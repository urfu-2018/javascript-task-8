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
    let results = new Array(jobs.length);
    let count = 0;
    let globalResolve;

    if (jobs.length === 0) {
        return [];
    }

    return new Promise(resolve => {
        globalResolve = resolve;
        while (count < parallelNum) {
            runJob(count++);
        }
    });

    async function getJobPromise(indexJob) {
        return new Promise((resolve, reject) => {
            jobs[indexJob]()
                .then(resolve);
            setTimeout(reject, timeout, new Error('Promise timeout'));
        });
    }

    function runJob(indexJob) {
        return getJobPromise(indexJob)
            .then(result => {
                results[indexJob] = result;
            })
            .then(goNextOrQuit)
            .catch(result => {
                results[indexJob] = result;
            })
            .catch(goNextOrQuit);
    }

    async function goNextOrQuit() {
        if (count < jobs.length) {
            runJob(count++);
        } else {
            end(results);
        }
    }

    function end(result) {
        globalResolve(result);
    }
}

module.exports = {
    runParallel,

    isStar
};
