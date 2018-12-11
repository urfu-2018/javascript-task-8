'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;


class ParallelRun {
    constructor(jobs, parallelNum, timeout) {
        this.jobs = jobs;
        this.parallelNum = parallelNum;
        this.timeout = timeout;
        this.results = [];
        this.jobCounter = 0;
    }

    runParallel() {
        return new Promise(
            resolve => {
                if (!this.jobs.length) {
                    return resolve(this.results);
                }

                this.jobs
                    .slice(0, this.parallelNum)
                    .forEach(job => this.start(job, this.jobCounter++, resolve));
            });
    }

    start(job, index, resolve) {
        const handle = result => this.handleResult(result, index, resolve);
        this.runWithTimeout(job, this.timeout).then(handle, handle);
    }

    handleResult(result, index, resolve) {
        this.results[index] = result;

        if (Object.keys(this.results).length === this.jobs.length) {
            return resolve(this.results);
        }

        if (this.jobCounter < this.jobs.length) {
            this.start(this.jobs[this.jobCounter], this.jobCounter++, resolve);
        }
    }

    runWithTimeout(job, timeout) {
        let timeoutPromise = new Promise(
            (resolve, reject) => {
                setTimeout(reject, timeout, new Error('Promise timeout'));
            });

        return Promise.race([job(), timeoutPromise]);
    }
}


/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new ParallelRun(jobs, parallelNum, timeout).runParallel();
}


module.exports = {
    runParallel,
    isStar
};
