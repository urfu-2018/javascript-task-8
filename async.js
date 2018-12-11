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
    if (!jobs.length || parallelNum <= 0) {
        return Promise.resolve([]);
    }

    const resultOfAllJob = [];
    let counter = 0;

    function start(jobRemaining) {
        if (!jobRemaining.length) {
            return;
        }

        const indexOfJob = counter++;
        let id;

        return Promise.race([
            new Promise(resolve => {
                id = setTimeout(resolve, timeout, new Error('Promise timeout'));
            }),
            jobRemaining.shift()().catch(error => error)
        ]).then(resultOfJob => {
            resultOfAllJob[indexOfJob] = resultOfJob;
            clearTimeout(id);

            return start(jobRemaining);
        });
    }

    const translates = [];

    while (parallelNum > 0 && jobs.length) {
        translates.push(start(jobs));
        parallelNum--;
    }

    return Promise.all(translates).then(() => resultOfAllJob);
}

module.exports = {
    runParallel,

    isStar
};
