'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @returns {Promise<Array>}
 */
function runParallel(jobs) {
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    return jobs.reduce((p, f) => p.then(f), Promise.resolve());

}

module.exports = {
    runParallel,

    isStar
};
