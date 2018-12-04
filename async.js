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
    // асинхронная магия
    return new Promise(function (resolve) {
        if (!jobs || !parallelNum) {
            resolve([]);
        }
        const results = [];
        const taskLimit = Math.min(jobs.length, parallelNum);
        const timeoutPromise = new Promise(function (res, rej) {
            setTimeout(rej, timeout, new Error('Translation time expired'));
        });
        var taskIndex = 0;
        function handleTask(taskId) {
            return function (result) {
                results[taskId] = result;
                if (results.length === jobs.length) {
                    resolve(result);
                }
                if (results.length < jobs.length) {
                    runTask(taskIndex++);
                }
            };
        }

        async function runTask(taskId) {
            const task = jobs[taskId]();
            const cb = handleTask(taskId);
            Promise
                .race([task, timeoutPromise])
                .then(cb, cb);
        }

        for (let i = 0; i < taskLimit; i++) {
            runTask(taskIndex++);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
