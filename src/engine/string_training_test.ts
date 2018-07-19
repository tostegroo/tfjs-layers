// Show off VocabLayer when  you get to this point.


import {Tensor, tensor2d} from '@tensorflow/tfjs-core';
import {expectValuesInRange} from '@tensorflow/tfjs-core/dist/test_util';

import * as tfl from '../index';
import {initializers} from '../index';
import {describeMathCPUAndGPU} from '../utils/test_utils';
import {expectTensorsClose} from '../utils/test_utils';

describeMathCPUAndGPU('String preproc : Model.predict', () => {
  it('basic model usage: Sequential predict', () => {
    // Define the vocabulary initializer
    const vocabInitializer = initializers.knownVocab(
        {strings: ['hello', 'world', 'こんにちは', '世界']});
    // Define a Sequential model with just a vocab layer
    const knownVocabSize = 4;
    const hashVocabSize = 1;
    const vocabModel = tfl.sequential({
      layers: [tfl.layers.vocab({
        name: 'myVocabLayer',
        knownVocabSize,
        hashVocabSize,
        vocabInitializer,
        inputShape: [2]  // two words per example
      })]
    });
    // Matches known words.
    const x = tfl.preprocessing.stringTensor2d(
        [['world', 'hello'], ['世界', 'こんにちは']], [2, 2]);
    const y = vocabModel.predict(x) as Tensor;
    const yExpected = tensor2d([[1, 0], [3, 2]], [2, 2], 'int32');
    expectTensorsClose(y, yExpected);
    // Handles unknown words.
    const xOutOfVocab = tfl.preprocessing.stringTensor2d(
        [['these', 'words'], ['are', 'out'], ['of', 'vocabulary']], [3, 2]);
    const yOutOfVocab = vocabModel.predict(xOutOfVocab) as Tensor;
    // Out-of-vocab words should hash to buckets after the knownVocab
    expectValuesInRange(
        yOutOfVocab, knownVocabSize, knownVocabSize + hashVocabSize);
  });

  it('basic model usage: Functional predict', () => {
    // Define the vocabulary initializer
    const vocabInitializer = initializers.knownVocab(
        {strings: ['hello', 'world', 'こんにちは', '世界']});
    // Define a functional-style model with just a vocab layer
    const knownVocabSize = 4;
    const hashVocabSize = 1;
    const input = tfl.input({shape: [2], dtype: 'string'});
    const vocabLayer = tfl.layers.vocab({
      name: 'myVocabLayer',
      knownVocabSize,
      hashVocabSize,
      vocabInitializer,
      inputShape: [2]  // two words per example
    });
    const outputSymbolic = vocabLayer.apply(input) as tfl.SymbolicTensor;
    const vocabModel = tfl.model({inputs: input, outputs: outputSymbolic});
    // Matches known words.
    const x = tfl.preprocessing.stringTensor2d(
        [['world', 'hello'], ['世界', 'こんにちは']], [2, 2]);
    const y = vocabModel.predict(x) as Tensor;
    const yExpected = tensor2d([[1, 0], [3, 2]], [2, 2], 'int32');
    expectTensorsClose(y, yExpected);
    // Handles unknown words.
    const xOutOfVocab = tfl.preprocessing.stringTensor2d(
        [['these', 'words'], ['are', 'out'], ['of', 'vocabulary']], [3, 2]);
    const yOutOfVocab = vocabModel.predict(xOutOfVocab) as Tensor;
    // Out-of-vocab words should hash to buckets after the knownVocab
    expectValuesInRange(
        yOutOfVocab, knownVocabSize, knownVocabSize + hashVocabSize);
  });
});



//  ORIGINAL SKETCH
// describeMathCPUAndGPU('String Preproc Model.fit', () => {

// DO NOT SUBMIT UNTIL THIS WORKS.
// 7/19/ 1. Test individual layer's 'fitUnsupervised'.
//       2. Update model.fit to call PreProcessingLayer's 'fitUnsupervised'
/*
describeMathCPU('String Preproc Model.fit', () => {
  fit('no need to compile', async done => {
    // Define the vocabulary initializer
    const vocabInitializer = initializers.knownVocab(
        {strings: ['hello', 'world', 'こんにちは', '世界']});
    // Define a Sequential model with just a vocab layer
    const knownVocabSize = 4;
    const hashVocabSize = 1;
    const vocabModel = tfl.sequential({
      layers: [tfl.layers.vocab({
        name: 'myVocabLayer',
        knownVocabSize,
        hashVocabSize,
        vocabInitializer,
        inputShape: [2]  // two words per example
      })]
    });
    // Compile the model with an optimizer for the vocab layer.
    vocabModel.compile({optimizer: 'SGD', loss: 'meanSquaredError'});

    const trainInputs = tfl.preprocessing.stringTensor2d(
        [['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd']]);
    // Fit the model to a tensor of strings
    console.log('AAA');
    vocabModel.fit(trainInputs, null, {batchSize: 1, epochs: 1}).catch(err => {
      done.fail(err.stack);
    });
    console.log('BBB');
    // call predict on a string of inputs and expect the new vocab values.
    const testInputs = tfl.preprocessing.stringTensor2d(
        [['a', 'b'], ['c', 'd'], ['hello', 'world']]);
    const testOutputs = vocabModel.predict(testInputs);
    test_util.expectArraysClose(
        testOutputs as Tensor, tensor2d([[0, 1], [2, 3], [4, 4]]));
    done();
  });
});
*/
