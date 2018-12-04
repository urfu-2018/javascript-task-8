'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = false;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum) {
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

        const next = () => {
            if (jobsResult.length === jobs.length) {
                resolve(jobsResult);
            }
            if (globalIndex < jobs.length) {
                const { job, i } = jobsWithIndex[globalIndex];
                job()
                    .then(result => {
                        jobsResult[i] = result;
                        globalIndex++;
                        next();
                    })
                    .catch(error => {
                        jobsResult[i] = error;
                        globalIndex++;
                        next();
                    });
            }
        };

        const startWork = tasks => {
            globalIndex = tasks.length;
            tasks.forEach(({ job, i }) => {
                job()
                    .then(result => {
                        jobsResult[i] = result;
                        next();
                    })
                    .catch(error => {
                        jobsResult[i] = error;
                        next();
                    });
            });
        };

        startWork(currentJobs);
    });
}

module.exports = {
    runParallel,

    isStar
};
