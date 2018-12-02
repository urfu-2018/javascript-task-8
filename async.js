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

    return new Promise(function (resolve) {
        if (jobs.length === 0) {
            resolve(jobs);
        }

        parallelNum = Math.min(parallelNum, jobs.length);

        const results = [];

        let current = 0;

        const createHandler = id => result => {
            results[id] = result;

            if (results.length === jobs.length) {
                return resolve(results);
            }

            if (current < jobs.length) {
                handleJob(current++);
            }
        };

        async function handleJob(id) {
            const promise = jobs[id]();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(reject, timeout, new Error('Promise timeout')));

            const handle = createHandler(id);

            try {
                const result = await Promise.race([promise, timeoutPromise]);
                handle(result);
            } catch (error) {
                handle(error);
            }
        }

        for (let id = 0; id < parallelNum; id++) {
            handleJob(current++);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
