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
    if (parallelNum <= 0 || !jobs.length) {
        return Promise.resolve([]);
    }
    let results = [];
    let succeedJobs = 0;
    function range(restJobs) {
        if (!restJobs.length) {
            return;
        }
        let i = succeedJobs++;
        let nextJob = Promise.race([
            new Promise(resolve => setTimeout(resolve, timeout, new Error('Promise timeout'))),
            restJobs.shift()().catch(error => error)
        ]);

        return nextJob.then((result) => {
            results[i] = result;

            return range(restJobs);
        });
    }
    let ranges = [];
    while (parallelNum-- > 0 && jobs.length > 0) {
        ranges.push(range(jobs));
    }

    return Promise.all(ranges).then(() => results);

}

module.exports = {
    runParallel,

    isStar
};
