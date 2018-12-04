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

    return new Promise(resolve => {
        if (!jobs.length) {
            resolve([]);
        }

        const result = [];
        const countJobs = jobs.length;
        const count = countJobs < parallelNum ? countJobs : parallelNum;
        let indexFlow = 0;

        while (indexFlow < count) {
            doJobs(indexFlow++);
        }

        function doJobs(index) {
            const job = jobs[index];

            return Promise
                .race([
                    job(),
                    new Promise(reject => {
                        setTimeout(reject, timeout, new Error('Promise timeout'));
                    })
                ])
                .then(reject => {
                    result[index] = reject;
                    if (result.length === countJobs) {
                        resolve(result);
                    }
                    if (indexFlow < countJobs) {
                        doJobs(indexFlow++);
                    }
                }, reject => {
                    result[index] = reject;
                    if (result.length === countJobs) {
                        resolve(result);
                    }
                    if (indexFlow < countJobs) {
                        doJobs(indexFlow++);
                    }
                });
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
