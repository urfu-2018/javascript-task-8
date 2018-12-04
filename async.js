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
function runParallel(jobs, parallelNum, timeout = 100000) {
    if (jobs.length === 0) {
        return Promise.resolve([]);
    }

    let jobsResult = [];
    let globalIndex = 0;
    let currentJobs = [];
    const jobsWithIndex = jobs.map((job, i) => ({ job, i }));

    return new Promise(resolve => {
        if (jobs.length <= parallelNum) {
            currentJobs.push(...jobsWithIndex);
        } else {
            currentJobs.push(...jobsWithIndex.slice(0, parallelNum));
        }

        function next(ind) {
            if (jobsResult.length === jobs.length) {
                resolve(jobsResult);
            }
            if (ind < jobs.length) {
                const { job, i } = jobsWithIndex[ind];
                doJobWithTimer(job, i);
            }
        }

        const startWork = tasks => {
            globalIndex = tasks.length;
            tasks.forEach(({ job, i }) => doJobWithTimer(job, i));
        };

        function doJobWithTimer(job, i) {
            return Promise.race([job(), startTimer()])
                .then(result => saveResultAndGoNext(result, i))
                .catch(error => saveResultAndGoNext(error, i));
        }

        function startTimer() {
            return new Promise((_, reject) => setTimeout(() => reject(new Error('Promise timeout')),
                timeout));
        }

        function saveResultAndGoNext(res, index) {
            jobsResult[index] = res;
            next(globalIndex++);
        }

        startWork(currentJobs);
    });
}

module.exports = {
    runParallel,

    isStar
};
