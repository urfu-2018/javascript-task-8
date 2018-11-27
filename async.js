'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;


function concurrentMap(iterable, concurrency, mapFunc) {
    return new Promise(resolve => {
        const result = [];
        const iterator = iterable[Symbol.iterator]();
        let isIteratorStopped = false;
        let pendingTasks = 0;
        let currentIndex = 0;

        function runNextJob() {
            const nextItem = iterator.next();
            const i = currentIndex;
            currentIndex++;

            if (nextItem.done) {
                isIteratorStopped = true;

                if (pendingTasks === 0) {
                    resolve(result);
                }

                return;
            }

            pendingTasks++;

            function addToResultAndRunNext(value) {
                result[i] = value;
                pendingTasks--;
                runNextJob();
            }

            Promise.resolve(nextItem.value)
                .then(element => mapFunc(element))
                .then(addToResultAndRunNext)
                .catch(addToResultAndRunNext);
        }

        for (let i = 0; i < concurrency; i++) {
            runNextJob();

            if (isIteratorStopped) {
                break;
            }
        }
    });
}


function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

    return concurrentMap(jobs, parallelNum,
        jobFactory => Promise.race([
            jobFactory(),
            wait(timeout)
                .then(() => {
                    throw new Error('Promise timeout');
                })
        ]));
}


module.exports = {
    runParallel,

    isStar
};
