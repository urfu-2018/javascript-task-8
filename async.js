'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

function limit(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
        .then(() => {
            throw new Error();
        });
}

class JobScheduler {
    constructor(jobs, concurrencyLevel, timeout) {
        this.jobs = jobs;
        this.concurrencyLevel = concurrencyLevel;
        this.timeout = timeout;
        this.jobIndex = 0;
        this.results = [];
    }

    produceWrappedJob(promiseFactory) {
        return Promise.race([
            promiseFactory(),
            limit(this.timeout)
        ]);
    }

    putResultAndRunNext(result, index) {
        this.results[index] = result;
        if (this.results.length === this.jobs.length) {
            this.resolve(this.results);

            return;
        }
        if (this.jobIndex < this.jobs.length) {
            this.runJob();
        }
    }

    runJob() {
        const index = this.jobIndex++;
        const job = this.jobs[index];

        this.produceWrappedJob(job)
            .then(value => this.putResultAndRunNext(value, index))
            .catch(error => this.putResultAndRunNext(error, index));
    }

    run() {
        return new Promise(resolve => {
            this.resolve = resolve;
            for (let i = 0; i < this.concurrencyLevel; i++) {
                this.runJob();
            }
        });
    }
}

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

    return new JobScheduler(jobs, parallelNum, timeout).run();
}

module.exports = {
    runParallel,

    isStar
};
