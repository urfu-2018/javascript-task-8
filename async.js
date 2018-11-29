'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

const ERROR = new Error('Promise timeouttTTT');

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    const couples = makeChunks(jobs, parallelNum);

    return couples.reduce((promiseChain, curCouple) => {
        return promiseChain
            .then(result => resolveCouple(curCouple, timeout)
                .then(Array.prototype.concat.bind(result)));
    }, Promise.resolve([]));
}

function resolveCouple(coupleOfJobs, timeout) {
    const promisesArray = coupleOfJobs.map(job => promiseWithTimeout(job(), timeout));

    return Promise.all(promisesArray);
}

function promiseWithTimeout(promise, ms) {
    let id;
    const timeout = new Promise((resolve, reject) => {
        id = setTimeout(() => {
            reject(ERROR);
        }, ms);
    });

    return Promise.race([
        timeout,
        promise
    ]).then(result => {
        clearTimeout(id);

        return Promise.resolve(result);
    })
        .catch(error => {
            clearTimeout(id);

            return Promise.resolve(error);
        });
}

function makeChunks(array, size) {
    const copy = array.slice();
    const result = [];

    while (copy.length) {
        result.push(copy.splice(0, size));
    }

    return result;
}

module.exports = {
    runParallel,

    isStar
};
