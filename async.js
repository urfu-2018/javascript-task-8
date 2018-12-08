'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

function runWithTimeout(job, timeout) {
    let throwAfterTimeout = new Promise(
        (resolve, reject) => {
            setTimeout(reject, timeout, new Error('Promise timeout'));
        });

    return Promise.race([job(), throwAfterTimeout]);
}

class ParallelRunner {
    constructor(jobs, parallelNum, timeout) {
        this.jobs = jobs;
        this.parallelNum = parallelNum;
        this.timeout = timeout;
        this.finishedCnt = 0;
        this.lastIndex = 0;
        this.ans = [];
    }

    saveAndEnqueue(result, currentIndex, resolve) {
        this.ans[currentIndex] = result;
        this.finishedCnt += 1;
        if (this.finishedCnt === this.jobs.length) {
            return resolve(this.ans);
        }
        if (this.lastIndex < this.jobs.length) {
            this.enqueueJob(resolve);
        }
    }

    enqueueJob(resolve) {
        let currentIndex = this.lastIndex;
        let saveAndEnqueue = result => this.saveAndEnqueue(result, currentIndex, resolve);
        runWithTimeout(this.jobs[this.lastIndex++], this.timeout)
            .then(saveAndEnqueue, saveAndEnqueue);
    }

    runParallel() {
        return new Promise(resolve => {
            if (this.jobs.length === 0) {
                return resolve([]);
            }

            for (let i = 0; i < Math.min(this.parallelNum, this.jobs.length); ++i) {
                this.enqueueJob(resolve);
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
    return new ParallelRunner(jobs, parallelNum, timeout).runParallel();
}

module.exports = {
    runParallel,

    isStar
};
