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
        if (! (jobs && jobs.length)) {
            resolve([]);
        }
        // счетчик-указатель на индекс не выполненной задачи из jobs
        let nextNotHandled = 0;
        const TRANSLATIONS = [];
        const resolveTranslation = (index) => {
            // обработчик результата запроса на получение перевода
            const requestResolver = (result) => {
                TRANSLATIONS[index] = result;
                if (TRANSLATIONS.length === jobs.length) {
                    resolve(TRANSLATIONS);
                } else {
                    resolveTranslation(nextNotHandled++);
                }
            };
            // выполнение запроса на получение перевода
            new Promise((innerResolver) => {
                setTimeout(innerResolver, timeout, new Error('Promise timeout'));
                jobs[index]()
                    .then(innerResolver)
                    .catch(innerResolver);
            })
                .then(requestResolver);
        };
        // запуск первых parallelNum промисов
        for (let i = 0; i < parallelNum; i++) {
            resolveTranslation(nextNotHandled++);
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
