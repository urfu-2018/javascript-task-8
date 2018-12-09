'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

function timeoutPromise(timeout) {
    return new Promise((resolve, reject) =>
        setTimeout(reject, timeout, new Error('Promise timeout')));
}

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        if (jobs.length === 0) {
            return resolve([]);
        }

        let taskIndex;
        const tasksQueue = [];

        function addTask(jobNumber) {
            function endTask(result) {
                tasksQueue[jobNumber] = result;
                if (tasksQueue.length === jobs.length) {
                    return resolve(tasksQueue);
                }

                if (taskIndex < jobs.length) {
                    addTask(taskIndex);
                    taskIndex++;
                }
            }

            // noinspection JSCheckFunctionSignatures
            Promise
                .race([jobs[jobNumber](), timeoutPromise(timeout)])
                .then(endTask, endTask);
        }

        for (taskIndex = 0; taskIndex < Math.min(jobs.length, parallelNum); taskIndex++) {
            addTask(taskIndex);
        }
    });
}


module.exports = {
    runParallel,
    isStar
};
