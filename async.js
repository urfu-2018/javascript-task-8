'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        const res = [];
        let pointerJob = 0;

        if (jobs.length === 0) {
            resolve([]);

            return;
        }

        while (pointerJob < parallelNum) {
            run(pointerJob++);
        }

        function run(index) {
            let job = jobs[index];

            Promise.race([
                job(),
                new Promise(reject =>
                    setTimeout(reject, timeout, new Error(`Promise timeout`)))
            ])
                .then(x => handleResult(x, index))
                .catch(x => handleResult(x, index));
        }

        function handleResult(result, index) {
            res[index] = result;

            if (res.length === jobs.length) {
                resolve(res);

                return;
            }

            if (pointerJob < jobs.length) {
                run(pointerJob++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
