/* eslint-env mocha */
'use strict';

const assert = require('assert');
const sinon = require('sinon');

const async = require('./async');

describe('runParallel tests', () => {
    it(
        'Из 2 промисов параллельно исполняется только 1 промис. Проверяем порядок вызовов',
        async () => {
            const spies = [sinon.spy(), sinon.spy()];

            const asyncOperation = (spy, index) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        spy();
                        resolve(index);
                    }, 100);
                });
            };

            const jobs = spies.map((spy, index) => asyncOperation.bind(null, spy, index));
            await async.runParallel(jobs, 1);

            spies.forEach((spy, index) => {
                assert(spy.calledOnce, `spy № ${index} вызван один раз`);
            });

            assert(spies[0].calledBefore(spies[1]), 'spy № 1 вызван перед spy № 2');
        });
});
