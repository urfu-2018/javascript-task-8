'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;
let results;
let count;
let globalResolve;
let countFinished;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    results = new Array(jobs.length);
    count = 0;
    countFinished = 0;


    if (jobs.length === 0) {
        return [];
    }

    return new Promise(resolve => {
        globalResolve = resolve;
        while (count < parallelNum) {
            runJob(jobs, count++, timeout);
        }
    });
}

function getJobPromise(job, timeout) {
    return new Promise((resolve, reject) => {
        job()
            .then(resolve, reject);
        setTimeout(reject, timeout, new Error('Promise timeout'));
    });
}

function runJob(jobs, indexJob, timeout) {
    return getJobPromise(jobs[indexJob], timeout)
        .then(result => {
            results[indexJob] = result;
            goNextOrQuit(jobs.length);
        })
        .catch(result => {
            results[indexJob] = result;
            goNextOrQuit(jobs.length);
        });
}

function goNextOrQuit(globalJobsCount) {
    countFinished++;
    if (count < globalJobsCount) {
        runJob(count++);
    } else if (countFinished === globalJobsCount) {
        end();
    }
}

function end() {
    globalResolve(results);
}

module.exports = {
    runParallel,

    isStar
};
