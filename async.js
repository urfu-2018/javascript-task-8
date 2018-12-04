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

        function addTask(innerTaskNumber) {
            const finishCallback = result => {
                queue[innerTaskNumber] = result;
                if (queue.length === tasks.length) {
                    return resolve(queue);
                }

                if (taskNumber + 1 < tasks.length) {
                    taskNumber++;
                    addTask(taskNumber);
                }
            };

            Promise
                .race([tasks[innerTaskNumber](), timeoutPromise(timeout)])
                .then(finishCallback, finishCallback);
        }

        for (let index = 0; index < Math.min(tasks.length, parallelNum); index++) {
            taskNumber++;
            addTask(taskNumber);
        }
    });
}


module.exports = {
    runParallel,
    isStar
};
