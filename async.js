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

        let taskNumber = 0;
        const tasksQueue = [];

        function addTask(jobNumber) {
            function endTask(result) {
                tasksQueue[jobNumber] = result;
                if (tasksQueue.length === jobs.length) {
                    return resolve(tasksQueue);
                }

                if (taskNumber < jobs.length) {
                    taskNumber++;
                    addTask(taskNumber - 1);
                }
            }

            Promise
                .race([jobs[jobNumber](), timeoutPromise(timeout)])
                .then(endTask);
        }

        for (let index = 0; index < Math.min(jobs.length, parallelNum); index++) {
            taskNumber++;
            addTask(taskNumber - 1);
        }


    });
}


module.exports = {
    runParallel,
    isStar
};
