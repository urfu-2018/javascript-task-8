'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum) {
    const indexJobs = jobs.map((x, i) => ({ x, i }));
    const result = [];
    let finishedJobs = 0;

    if (!jobs.length) {
        return Promise.resolve(result);
    }

    return new Promise(resolve => {
        function setResult(data, index) {
            result[index] = data;
            finishedJobs++;
        }

        const begin = () => {
            if (finishedJobs === jobs.length) {
                resolve(result);
            }
            if (indexJobs.length) {
                let job = indexJobs.shift();
                job.x()
                    .then(x => setResult(x, job.i), x => setResult(x, job.i))
                    .then(begin);
            }
        };

        for (let i = 0; i < jobs.length && i < parallelNum; i++) {
            begin();
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
