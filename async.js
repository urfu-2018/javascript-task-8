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
    return new Promise(resolve => {
        if (jobs.length === 0) {
            resolve([]);
        }

        const queue = [];
        for (let i = 0; i < jobs.length; i++) {
            queue.push(jobs[i]);
        }

        const result = [];
        const count = Math.min(jobs.length, parallelNum);

        for (let i = 0; i < count; i++) {
            doWork();
        }

        function doWork() {
            if (queue.length === 0) {
                resolve(result);

                return;
            }

            const item = queue.shift();
            Promise.race([item(), startTimer()])
                .then(res => result.push(res), res => result.push(res))
                .then(doWork, doWork);
        }

        function startTimer() {
            return new Promise((then, reject) => {
                setTimeout(() => {
                    reject(new Error('Promise timeout'));
                }, timeout);
            });
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
