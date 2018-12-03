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
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    return new Promise(resolve => {
        const res = [];
        let curri = 0;
        const countOfParallel = Math.min(jobs.length, parallelNum);
        while (curri < countOfParallel) {
            startNewPromise(curri++);
        }

        async function startNewPromise(index) {
            function addJob(job) {
                res[index] = job;
                if (jobs.length > res.length) {
                    startNewPromise(curri++);
                }
                if (res.length === jobs.length) {
                    resolve(res);
                }
            }

            return (new Promise(reject => {
                setTimeout(reject, timeout, new Error('Promise timeout'));
                jobs[index]().then(reject, reject);
            }))
                .then(addJob);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
