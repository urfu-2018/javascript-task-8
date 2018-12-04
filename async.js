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
 * @param {Function<Promise>[]} tasks – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(tasks, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        if (tasks.length === 0) {
            return resolve([]);
        }

        let taskNumber = 0;
        const queue = [];

        function addTask(taskID) {
            function endTask(result) {
                queue[taskID] = result;
                if (queue.length === tasks.length) {
                    return resolve(queue);
                }

                if (taskNumber < tasks.length) {
                    taskNumber++;
                    addTask(taskNumber - 1);
                }
            }

            Promise
                .race([tasks[taskID](), timeoutPromise(timeout)])
                .then(endTask, endTask);
        }

        for (let index = 0; index < Math.min(tasks.length, parallelNum); index++) {
            taskNumber++;
            addTask(taskNumber - 1);
        }


    });
}


module.exports = {
    runParallel,
    isStar
};
