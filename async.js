'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

const startJob = (job, timeout) => new Promise(res => {
    setTimeout(() => res(new Error('Promise timeout')), timeout);
    job().then(res, res);
});

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
const runParallel = (jobs, parallelNum, timeout = 1000) => new Promise(res => {
    if (!jobs.length || parallelNum <= 0) {
        res([]);
    }
    const result = [];
    let counter = parallelNum - 1;
    let finished = 0;
    const doJob = i => startJob(jobs[i], timeout).then(val => {
        result[i] = val;
        counter += 1;
        finished += 1;
        if (finished >= jobs.length) {
            res(result);
        } else {
            return doJob(counter);
        }
    });

    [...Array(parallelNum).keys()].forEach(doJob);
});


module.exports = {
    runParallel,
    isStar
};
