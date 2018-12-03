'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

class WorkersPool {
    constructor(jobs, workersCount, jobTimeout) {
        this.jobs = jobs;
        this.jobTimeout = jobTimeout;
        this.jobIndex = 0;

        this.workers = [];

        for (let i = 0; i < workersCount; i++) {
            this.workers.push(this.workerFunction());
        }
    }

    async workerFunction() {
        const result = [];
        while (this.jobIndex < this.jobs.length) {
            const job = this.jobs[this.jobIndex];
            const index = this.jobIndex;
            this.jobIndex++;
            try {
                const jobResult = await setPromiseTimeout(job(), this.jobTimeout);
                result.push([jobResult, index]);
            } catch (error) {
                result.push([error, index]);
            }
        }

        return result;
    }

    async run() {
        const totalResult = [];
        const workersResult = await Promise.all(this.workers);
        workersResult.forEach(resultArray => {
            resultArray.forEach(([result, jobIndex]) => {
                totalResult[jobIndex] = result;
            });
        });

        return totalResult;
    }
}


function setPromiseTimeout(promise, timeout) {
    const timerPromise = new Promise((resolve, reject) => {
        setTimeout(reject, timeout, new Error('Promise Timeout'));
    });

    return Promise.race([promise, timerPromise]);
}

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
async function runParallel(jobs, parallelNum, timeout = 1000) {
    if (jobs.length === 0) {
        return [];
    }

    return new WorkersPool(jobs, parallelNum, timeout).run();
}

module.exports = {
    runParallel,
    isStar
};
