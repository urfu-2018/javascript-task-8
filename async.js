'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

class ResultsContainer {
    constructor(totalJobs) {
        this.totalJobs = totalJobs;
        this.results = [];
        this.completeJobs = 0;
    }

    saveResult(id, result) {
        this.results[id] = result;
        this.completeJobs++;
    }

    isComplete() {
        return this.completeJobs >= this.totalJobs;
    }

    getResult() {
        return this.results;
    }
}

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    // асинхронная магия
    if (!jobs.length || parallelNum <= 0) {
        return Promise.resolve([]);
    }

    return new Promise((resolve) => {
        const results = new ResultsContainer(jobs.length);
        let index = 0;

        function handleJobEnd(id, result) {
            results.saveResult(id, result);

            if (results.isComplete()) {
                return resolve(results.getResult());
            } else if (index < jobs.length) {
                runNextJob();
            }
        }

        function runNextJob() {
            const savedIndex = index;
            executeJob(jobs[savedIndex], timeout).then(res => handleJobEnd(savedIndex, res));
            index++;
        }

        for (let i = 0; i < Math.min(jobs.length, parallelNum); i++) {
            runNextJob();
        }
    });
}

function executeJob(job, timeout) {
    return nonFailPromise(timeoutPromise(job(), timeout));
}

function timeoutPromise(promise, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, timeout, new Error('Promise timeout'));
        promise.then(resolve, reject);
    });
}

function nonFailPromise(promise) {
    return new Promise((resolve) => promise.then(resolve, resolve));
}

module.exports = {
    runParallel,

    isStar
};
