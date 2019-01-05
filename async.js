'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция параллельно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    // асинхронная магия
    const result = [];

    return new Promise(resolve => {
        if (!jobs[0]) {
            resolve(result);
        }
        let counter = 0;
        while (counter < parallelNum && counter < jobs.length) {
            perform(counter++);
        }

        function perform(index) {
            const race1 = jobs[index]();
            const race2 = new Promise(reject => {
                setTimeout(reject, timeout, new Error('Promise timeout'));
            });

            Promise.race([race1, race2])
                .then(res => goNextOrFinish(res, index))
                .catch(err => goNextOrFinish(err, index));
        }

        function goNextOrFinish(element, index) {
            result[index] = element;
            if (result.length === jobs.length) {
                resolve(result);
            } else {
                perform(counter++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
