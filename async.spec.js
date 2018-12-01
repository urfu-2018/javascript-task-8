/* eslint-env mocha */
'use strict';

const assert = require('assert');
const sinon = require('sinon');

const async = require('./async');

function createAsyncJob(spy) {
    return () => new Promise(resolve => {
        setTimeout(() => {
            spy();
            resolve();
        }, 100);
    });
}

describe('runParallel tests', () => {
    it('Из 2 промисов параллельно исполняется только один с учетом порядка', () => {
        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();

        return async
            .runParallel([
                createAsyncJob(firstSpy),
                createAsyncJob(secondSpy)
            ], 1)
            .then(() => {
                assert(firstSpy.calledOnce, 'Spy №1 вызван один раз');
                assert(secondSpy.calledOnce, 'Spy №2 вызван один раз');

                assert(firstSpy.calledBefore(secondSpy), 'Spy №1 вызван перед Spy №2');
            });
    });

    it('Simple test', () => {
        return async
            .runParallel([
                () => Promise.resolve('a'),
                () => new Promise((resolve) => {
                    resolve(17);
                })
            ], 1)
            .then(values => {
                assert.equal(values[0], 'a');
                assert.equal(values[1], 17);
            });
    });
});
