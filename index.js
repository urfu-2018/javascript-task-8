'use strict';

const { get } = require('got');

const async = require('./async');

const key = require('./key.json').key;

/**
 * Возвращает функцию, которая возвращает промис
 * @param {String} lang - язык на который нужно перевести
 * @param {String} text - переводимый текст
 * @returns {Function<Promise>}
 */
function createTranslationJob(lang, text) {
    return () => get('https://translate.yandex.net/api/v1.5/tr.json/translate', {
        query: { key, lang, text },
        json: true
    });
}

const languages = ['be', 'uk', 'en', 'fr', 'de', 'it', 'pl', 'tr', 'th', 'ja'];
const text = 'дайте мне воды';

const jobs = languages.map(language => createTranslationJob(language, text));

async
    .runParallel(jobs, 2)
    .then(result => result.map(item => item instanceof Error ? item : item.body.text[0]))
    .then(translations => translations.join('\n'))
    .then(console.info);

/*
    дайце мне вады
    дайте мені води
    give me water
    donnez-moi de l'eau
    gib mir Wasser
    dammi dell'acqua
    daj mi wody
    verin bana su
    ให้ฉัน้ำ
    い水
*/
