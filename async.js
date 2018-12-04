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
            return resolve([]);
        }

        let queue = [];
        let ans = [];
        let lastIndex = 0;

        function enqueueJob() {
            let currentIndex = lastIndex;

            function saveAndEnqueue(result) {
                ans[currentIndex] = result;
                if (lastIndex === jobs.length) {
                    return resolve(ans);
                }
                enqueueJob();
            }

            let promise = runWithTimeout(jobs[lastIndex++], timeout)
                .then(saveAndEnqueue, saveAndEnqueue);
            queue.push(promise);
        }

        for (let i = 0; i < Math.min(parallelNum, jobs.length); ++i) {
            enqueueJob();
        }
    });
}

function runWithTimeout(job, timeout) {
    let throwAfterTimeout = new Promise(
        (resolve, reject) => {
            setTimeout(reject, timeout, new Error('Promise timeout'));
        });

    return Promise.race([job(), throwAfterTimeout]);
}

module.exports = {
    runParallel,
    runWithTimeout,

    isStar
};
