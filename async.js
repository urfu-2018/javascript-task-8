'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

class ParallelUnit {
    constructor(jobs, timeout, parallelNum) {
        this.jobs = jobs;
        this.results = [];
        this.indexOfJob = 0;
        this.timeout = timeout;
        this.parallelNum = parallelNum;
    }

    makeResult(currentIndex, result, resolve) {
        this.results[currentIndex] = result;
        if (this.results.length !== this.jobs.length) {
            this.doJob(this.indexOfJob++, resolve);
        } else {
            return resolve(this.results);
        }
    }

    doJob(currentIndex, resolve) {
        let runningJob = this.jobs[currentIndex]();
        let timeOutJob = new Promise(reject =>
            setTimeout(reject, this.timeout, new Error('Promise timeout')));

        Promise
            .race([runningJob, timeOutJob])
            .then(result => this.makeResult(currentIndex, result, resolve))
            .catch(error => this.makeResult(currentIndex, error, resolve));
    }

    invoke() {
        if (this.jobs.length === 0) {
            return Promise.resolve([]);
        }
        if (this.jobs.length < this.parallelNum) {
            this.parallelNum = this.jobs.length;
        }

        return new Promise(resolve => {
            while (this.indexOfJob < this.parallelNum) {
                this.doJob(this.indexOfJob++, resolve);
            }
        }
        );
    }
}

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new ParallelUnit(jobs, timeout, parallelNum).invoke();
}

module.exports = {
    runParallel,

    isStar
};
