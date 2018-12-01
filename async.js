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
        let completedTasksCount = 0;
        let runningOrCompetedTasksCount = 0;
        for (var i = 0; i < Math.min(parallelNum, jobs.length); i++) {
            createTask(i);
        }

        /** Функция создает Promise с callback - запуском следующего таска из очереди
         * @param {Number} num -номер текущего задания
         */
        function createTask(num) {
            runningOrCompetedTasksCount += 1;
            const cb = x => {
                result[num] = x;
                completedTasksCount += 1;
                if (completedTasksCount !== jobs.length) {
                    createTask(runningOrCompetedTasksCount);
                } else {
                    return resolve(result);
                }

            };
            runWithTimeout(jobs[num]())
                .then(cb, cb);
        }
    });

    /** Функция, подготавливающая два задания - переданное и
     * setTimeout для ограничения времени выполнения
     * @param {Promise} job - задание
     * @returns {Promise}
     */
    function runWithTimeout(job) {
        return Promise.race([job,
            new Promise((_, reject) => {
                const id = setTimeout(() => {
                    clearTimeout(id);
                    reject(new Error('Promise timeout'));
                }, timeout);
            })]);
    }

}

module.exports = {
    runParallel,

    isStar
};
