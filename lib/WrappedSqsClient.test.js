/* eslint-env mocha */

// mocha imports
import chai from 'chai';
import chaiMatchPattern from 'chai-match-pattern';
chai.use(chaiMatchPattern);
const expect = chai.expect;

// npm imports
import { v4 as uuid } from 'uuid';

// lib imports
import { WrappedSqsClient } from './WrappedSqsClient.js';

const testQueueName = 'test';
const testQueueUrl = 'https://sqs.us-east-1.amazonaws.com/546652796775/test';

let logger;

describe('WrappedSqsClient', function () {
  describe('constructor', function () {
    it('should create a WrappedSqsClient instance', function () {
      const wrappedSqsClient = new WrappedSqsClient();
      expect(wrappedSqsClient).to.be.an.instanceof(WrappedSqsClient);
    });
  });

  describe('encodeMessageAttributes', function () {
    it('should return encoded attributes', function () {
      const messageAttributes = { foo: 'bar', baz: 123 };

      expect(
        WrappedSqsClient.encodeMessageAttributes(messageAttributes)
      ).to.deep.equal({
        foo: { DataType: 'String', StringValue: 'bar' },
        baz: { DataType: 'Number', StringValue: '123' },
      });
    });

    it('should support undefined input', function () {
      expect(WrappedSqsClient.encodeMessageAttributes()).to.deep.equal({});
    });
  });

  describe('decodeMessageAttributes', function () {
    it('should return encoded attributes', function () {
      const messageAttributes = {
        foo: { DataType: 'String', StringValue: 'bar' },
        baz: { DataType: 'Number', StringValue: '123' },
      };

      expect(
        WrappedSqsClient.decodeMessageAttributes(messageAttributes)
      ).to.deep.equal({ foo: 'bar', baz: 123 });
    });

    it('should support undefined input', function () {
      expect(WrappedSqsClient.decodeMessageAttributes()).to.deep.equal({});
    });
  });

  describe('decodeMessage', function () {
    it('should decode string message', function () {
      const message = {
        MessageId: '123',
        Body: 'abc',
        MessageAttributes: {
          foo: { DataType: 'String', StringValue: 'bar' },
          baz: { DataType: 'Number', StringValue: '123' },
        },
      };

      expect(WrappedSqsClient.decodeMessage(message)).to.deep.equal({
        messageId: '123',
        body: 'abc',
        attributes: { foo: 'bar', baz: 123 },
        receiptHandle: undefined,
      });
    });

    it('should decode object message', function () {
      const message = {
        MessageId: '123',
        Body: '{"foo":"bar"}',
        MessageAttributes: {
          foo: { DataType: 'String', StringValue: 'bar' },
          baz: { DataType: 'Number', StringValue: '123' },
        },
      };

      expect(WrappedSqsClient.decodeMessage(message)).to.deep.equal({
        messageId: '123',
        body: { foo: 'bar' },
        attributes: { foo: 'bar', baz: 123 },
        receiptHandle: undefined,
      });
    });

    it('should support undefined input', function () {
      expect(WrappedSqsClient.decodeMessage()).to.deep.equal({
        messageId: undefined,
        body: undefined,
        attributes: {},
        receiptHandle: undefined,
      });
    });
  });

  describe('queueExists', function () {
    it('should return true if queue exists', async function () {
      expect(await new WrappedSqsClient().queueExists(testQueueName)).to.be
        .true;
    });

    it('should return false if queue does not exist', async function () {
      // Generate random queue name.
      const queueName = uuid();

      expect(await new WrappedSqsClient().queueExists(queueName)).to.be.false;
    });
  });

  describe('getQueue', function () {
    it('should resolve url', async function () {
      const wrappedSqsClient = await new WrappedSqsClient().getQueue(
        testQueueName
      );

      expect(wrappedSqsClient.queueName).to.equal(testQueueName);
      expect(wrappedSqsClient.queueUrl).to.equal(testQueueUrl);
    });
  });

  describe('createQueue/deleteQueue', function () {
    it('should create & delete queue', async function () {
      // Generate random queue name.
      const queueName = uuid();

      // Create queue.
      const wrappedSqsClient = await new WrappedSqsClient({
        logger,
      }).createQueue(queueName);
      expect(wrappedSqsClient.queueName).to.equal(queueName);

      // Delete queue.
      await wrappedSqsClient.deleteQueue();

      // Vaidate state.
      expect(await wrappedSqsClient.queueExists(queueName)).to.be.false;
      expect(wrappedSqsClient.queueName).to.be.undefined;
      expect(wrappedSqsClient.queueUrl).to.be.undefined;
    });
  });

  describe('createQueue ... deleteQueue', function () {
    let queueName = '';

    /** @type {WrappedSqsClient} */
    let wrappedSqsClient;

    beforeEach(async function () {
      // Generate random queue name.
      queueName = uuid();

      // Create queue.
      wrappedSqsClient = await new WrappedSqsClient().createQueue(queueName);
    });

    describe('sendMessage/receiveMessage', function () {
      it('should send & receive a string message', async function () {
        // Compose message.
        const message = queueName;

        // Send message.
        await wrappedSqsClient.sendMessage({
          attributes: { foo: 'bar' },
          body: message,
        });

        // Receive message.
        const receivedMessages = await wrappedSqsClient.receiveMessages();
        expect(receivedMessages).to.have.lengthOf(1);
        expect(receivedMessages[0]).to.matchPattern(`{
        "attributes": { "foo": "bar" },
        "body": "${message}",
        ...
      }`);
      });

      it('should send & receive an object  message', async function () {
        // Compose message.
        const message = { queueName };

        // Send message.
        await wrappedSqsClient.sendMessage({
          attributes: { foo: 'bar' },
          body: message,
        });

        // Receive message.
        const receivedMessages = await wrappedSqsClient.receiveMessages();
        expect(receivedMessages).to.have.lengthOf(1);
        expect(receivedMessages[0]).to.matchPattern(`{
        "attributes": { "foo": "bar" },
        "body": ${JSON.stringify(message)},
        ...
      }`);
      });

      afterEach(async function () {
        // Delete queue.
        await wrappedSqsClient.deleteQueue();
      });
    });

    describe('sendMessageBatch/receiveMessage', function () {
      it('should send & receive a string message batch', async function () {
        // Send message.
        await wrappedSqsClient.sendMessageBatch([
          {
            attributes: { foo: 'bar1' },
            body: 'message1',
            id: '1',
          },
          {
            attributes: { foo: 'bar2' },
            body: 'message2',
            id: '2',
          },
          {
            attributes: { foo: 'bar3' },
            body: 'message3',
            id: '3',
          },
        ]);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Receive message.
        const receivedMessages = await wrappedSqsClient.receiveMessages();
        expect(receivedMessages).to.have.lengthOf(1);
      });
      afterEach(async function () {
        // Delete queue.
        await wrappedSqsClient.deleteQueue();
      });
    });
  });
});
