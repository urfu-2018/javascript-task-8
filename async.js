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
        const result = new Array(jobs.length);
        let completedTasks = 0;
        let runningTasks = 0;
        for (var i = 0; i < Math.min(parallelNum, jobs.length); i++) {
            createTask(i);
        }

        function createTask(num) {
            runningTasks += 1;
            const cb = x => {
                result[num] = x;
                completedTasks += 1;
                if (completedTasks !== jobs.length) {
                    createTask(runningTasks);
                } else {
                    return resolve(result);
                }

            };
            runWithTimeout(jobs[num]())
                .then(cb, cb);
        }
    });

    function runWithTimeout(job) {
        return Promise.race([job,
            new Promise((resolve, reject) => {
                const id = setTimeout(() => {
                    clearTimeout(id);
                    reject(new Error('promise timeout!'));
                }, timeout);
            })]);
    }

}

module.exports = {
    runParallel,

    isStar
};
