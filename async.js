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
    if (!jobs.length) {
        return Promise.resolve([]);
    }

    let jobsLeft = jobs.length;
    const gapLength = Math.min(parallelNum, jobs.length);
    let resultArray = [];
    let nextJobNum = 0;

    return new Promise(resolve => {
        for (nextJobNum; nextJobNum < gapLength; nextJobNum++) {
            doJobAsync(nextJobNum);
        }

        function doJobAsync(jobNum) {
            function saveData(data) {
                resultArray[jobNum] = data;
                if (--jobsLeft === 0) {
                    resolve(resultArray);

                    return;
                }

                if (nextJobNum < jobs.length) {
                    doJobAsync(nextJobNum++);
                }
            }

            getJobPromiseWithTimeout(jobNum)
                .then(result => saveData(result),
                    error => saveData(error));
        }

        function getJobPromiseWithTimeout(jobNum) {
            let timeoutPromise = new Promise((res, rej) =>
                setTimeout(() => rej(new Error('Promise timeout')),
                    timeout));

            return Promise
                .race([jobs[jobNum](), timeoutPromise]);
        }

    });

}

module.exports = {
    runParallel,

    isStar
};
