'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum) {

    if (jobs.length === 0) {
        Promise.resolve(jobs);
    }

    let promiseArray = [];

    function startPromise(index, currentJob, resolve) {

        function addPromiseToArray() {

            promiseArray[currentJob - 1] = jobs[currentJob - 1];

            if (jobs.length === promiseArray.length) {
                resolve(promiseArray);
            } else {
                startPromise(currentJob++, currentJob, resolve);
            }
        }

        return (new Promise(() => {
            jobs[currentJob - 1]()
                .then(addPromiseToArray);
        }));
    }

    return new Promise(resolve => {
        for (let currentJob = 0; currentJob < parallelNum; currentJob++) {
            startPromise(currentJob++, currentJob, resolve);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
