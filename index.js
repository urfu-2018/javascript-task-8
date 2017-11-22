'use strict';

const { format } = require('url');
const request = require('request-promise-native');

const async = require('./async');

const key = require('./key.json').key;

/**
 * Функция возвращает промис, который сразу же переходит в состояние 'pending'
 * @param {String} lang - язык на который нужно перевести
 * @param {String} text - переводимый текст
 * @returns {Promise}
 */
function getTranslation(lang, text) {
    const url = format({
        protocol: 'https',
        host: 'translate.yandex.net',
        pathname: 'api/v1.5/tr.json/translate',
        query: {
            key,
            lang,
            text
        }
    });

    return request.get(url);
}

const langs = ['be', 'uk', 'en', 'fr', 'de', 'it', 'pl', 'tr', 'th', 'ja'];
const text = 'дайте мне воды';

const jobs = langs.map(lang => getTranslation.bind(null, lang, text));

async
    .runParallel(jobs, 2)
    .then(result => {
        return result
            .map(item => item instanceof Error ? item : JSON.parse(item).text[0])
            .join('\n');
    })
    .then(console.log);

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
