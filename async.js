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

    const result = [];

    const run = async () => {
        for (let i = 0; i < jobs.length; i += parallelNum) {
            if (parallelNum === 1) {
                await Promise.resolve(jobs[i]())
                    .then(value => result.push(value))
                    .catch(value => result.push(value));
                // result.push(value);
            } else {
                const values = await runParallel(jobs.slice(i, i + parallelNum), 1);
                result.push(...values);
                // try {
                //     const values = await Promise.all(
                //         jobs
                //             .slice(i, i + parallelNum)
                //             .map(job => job())
                //     );
                //     result.push(...values);
                // } catch (err) {
                //     result.push(err);
                // }
            }
        }

        return new Promise(resolve => resolve(result));
    };

    return run();
}

module.exports = {
    runParallel,
    isStar
};
