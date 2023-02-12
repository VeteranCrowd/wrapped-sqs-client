// npm imports
import _ from 'lodash';
import {
  SQSClient,
  GetQueueUrlCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
} from '@aws-sdk/client-sqs';

// lib imports
import { Logger } from '@karmaniverous/edge-logger';

export class WrappedQueue {
  #logger;
  #queueName;
  #queueUrl;
  #sqsClient;

  constructor({ logger, config = { region: 'us-east-1' } } = {}) {
    this.#logger = logger ?? new Logger();
    this.#sqsClient = new SQSClient(config);
  }

  get queueName() {
    if (!this.#queueName) throw new Error('queue not yet initialized');
    return this.#queueName;
  }

  get queueUrl() {
    if (!this.#queueUrl) throw new Error('queue not yet initialized');
    return this.#queueUrl;
  }

  async init(queueName) {
    this.#logger.info(`Resolving queueName '${queueName}'...`);

    this.#queueName = queueName;
    this.#queueUrl = (
      await this.#sqsClient.send(
        new GetQueueUrlCommand({
          QueueName: queueName,
        })
      )
    ).QueueUrl;

    this.#logger.info(`Resolved to queueUrl '${this.#queueUrl}'.`);

    return this;
  }

  async receiveMessages({ limit = 1 } = {}) {
    if (!this.#queueUrl) throw new Error('queue not yet initialized');

    this.#logger.info(`Retrieving messages from queue '${this.#queueName}'...`);

    const receiveMessageCommand = new ReceiveMessageCommand({
      MaxNumberOfMessages: limit,
      MessageAttributeNames: ['.*'],
      QueueUrl: this.#queueUrl,
    });

    const response = await this.#sqsClient.send(receiveMessageCommand);
    const messages = response.Messages.map(
      ({ MessageId: messageId, Body, MessageAttributes }) => ({
        messageId,
        body: JSON.parse(Body),
        attributes: _.mapValues(
          MessageAttributes,
          ({ StringValue }) => StringValue
        ),
      })
    );

    this.#logger.info(`Retrieved ${messages.length} messages.`);
    this.#logger.debug(messages);

    return messages;
  }

  async purge() {
    if (!this.#queueUrl) throw new Error('queue not yet initialized');

    this.#logger.info(`Purging queue '${this.#queueName}'...`);

    const purgeQueueCommand = new PurgeQueueCommand({
      QueueUrl: this.#queueUrl,
    });

    const response = await this.#sqsClient.send(purgeQueueCommand);

    this.#logger.info(`Purged.`);
    this.#logger.debug(response);

    return response;
  }
}
