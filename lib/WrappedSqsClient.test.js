/* eslint-env mocha */

// mocha imports
import chai from 'chai';
const expect = chai.expect;

// npm imports
import { SQSClient } from '@aws-sdk/client-sqs';
import { v4 as uuid } from 'uuid';

// lib imports
import { WrappedSqsClient } from './WrappedSqsClient.js';

const testQueueName = 'test';
const testQueueUrl = 'https://sqs.us-east-1.amazonaws.com/546652796775/test';

describe('WrappedSqsClient', function () {
  describe('constructor', function () {
    it('should create a WrappedSqsClient instance', function () {
      const wrappedSqsClient = new WrappedSqsClient();
      expect(wrappedSqsClient).to.be.an.instanceof(WrappedSqsClient);
    });
  });

  describe('exists', function () {
    it('should return true if queue exists', async function () {
      expect(await new WrappedSqsClient().exists(testQueueName)).to.be.true;
    });

    it('should return false if queue does not exist', async function () {
      // Generate random queue name.
      const queueName = uuid();

      expect(await new WrappedSqsClient().exists(queueName)).to.be.false;
    });
  });

  describe('get', function () {
    it('should resolve url', async function () {
      const wrappedSqsClient = await new WrappedSqsClient().get(testQueueName);

      expect(wrappedSqsClient.name).to.equal(testQueueName);
      expect(wrappedSqsClient.url).to.equal(testQueueUrl);
    });
  });

  describe('create/delete', function () {
    it('should create & delete queue', async function () {
      // Generate random queue name.
      const queueName = uuid();

      // Create queue.
      const wrappedSqsClient = await new WrappedSqsClient().create(queueName);
      expect(wrappedSqsClient.name).to.equal(queueName);

      // Delete queue.
      await wrappedSqsClient.delete();

      // Vaidate state.
      expect(await wrappedSqsClient.exists(queueName)).to.be.false;
      expect(wrappedSqsClient.name).to.be.undefined;
      expect(wrappedSqsClient.url).to.be.undefined;
    });
  });
});
