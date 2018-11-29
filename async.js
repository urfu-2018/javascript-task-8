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
function runParallel(jobs, parallelNum = jobs.length, timeout = 1000) {
    const a = splitJobs(jobs, parallelNum);
    var j = [];
    a.forEach(function (i) {
        i.forEach(function (b) {
            j.push(promiseTimeout(timeout, b.call()));
        });
    });

    return Promise.all(j);
}

function promiseTimeout(ms, promise) {
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject();
        }, ms);
    }).catch(() => new Error('Promise timeout'));

    return Promise.race([
        promise,
        timeout
    ])
        .then(response => response, error => error);
}

function splitJobs(jobs, parallelNum) { // num on on level
    var parallels = [];
    var start = 0;
    var step = jobs.length / parallelNum;
    var finish = parallelNum;
    var j = 1;
    while (j <= step) {
        parallels.push(jobs.slice(start, finish));
        start = finish;
        finish = (finish + parallelNum > jobs.length) ? jobs.length : finish + parallelNum;
        j++;
    }

    return parallels;
}

module.exports = {
    runParallel,

    isStar
};
