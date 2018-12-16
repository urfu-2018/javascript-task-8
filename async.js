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
let globalJobs;
let globalTimeout;

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
    globalJobs = jobs;
    globalTimeout = timeout;

    if (jobs.length === 0) {
        return [];
    }

    return new Promise(resolve => {
        globalResolve = resolve;
        while (count < parallelNum) {
            runJob(count++);
        }
    });
}

function getJobPromise(indexJob) {
    return new Promise((resolve, reject) => {
        globalJobs[indexJob]()
            .then(resolve, reject);
        setTimeout(reject, globalTimeout, new Error('Promise timeout'));
    });
}

function runJob(indexJob) {
    return getJobPromise(indexJob)
        .then(result => {
            results[indexJob] = result;
            goNextOrQuit();
        })
        .catch(result => {
            results[indexJob] = result;
            goNextOrQuit();
        });
}

function goNextOrQuit() {
    countFinished++;
    if (count < globalJobs.length) {
        runJob(count++);
    } else if (countFinished === globalJobs.length) {
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
