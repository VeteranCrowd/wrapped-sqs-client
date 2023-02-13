/**
 * @module @veterancrowd/wrapped-queue
 */

// npm imports
import { Logger } from '@karmaniverous/edge-logger';
import _ from 'lodash';
import {
  CreateQueueCommand,
  DeleteQueueCommand,
  GetQueueUrlCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

/**
 * Wraps an AWS SQS queue to provide standard logging & services.
 */
export class WrappedQueue {
  #logger;
  #queueName;
  #queueUrl;
  #sqsClient;

  /**
   * WrappedQueue constructor.
   *
   * @param {object} [options] - Options.
   * @param {object} [options.logger] - Logger instance.
   * @param {object} [options.config] - Queue config.
   */
  constructor({ logger, config = { region: 'us-east-1' } } = {}) {
    this.#logger = logger ?? new Logger();
    this.#sqsClient = new SQSClient(config);
  }

  /**
   * Gets the queue name.
   *
   * @returns {string} Queue name.
   */
  get queueName() {
    if (!this.#queueName) throw new Error('queue not yet initialized');
    return this.#queueName;
  }

  /**
   * Gets the queue URL.
   *
   * @returns {string} Queue URL.
   */
  get queueUrl() {
    if (!this.#queueUrl) throw new Error('queue not yet initialized');
    return this.#queueUrl;
  }

  /**
   * Creates a new queue.
   *
   * @param {string} queueName - Queue name.
   * @param {object} [attributes] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#attributes CreateQueueCommandInput attributes}
   * @param {object} [tags] {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#tags CreateQueueCommandInput tags}
   * @returns {Promise<WrappedQueue>} This instance.
   */
  async create(queueName, attributes, tags) {
    // Validate parameters.
    if (!queueName) throw new Error('queueName is required');

    // Validate state.
    if (this.#queueUrl) throw new Error('queue already initialized');

    // Generate CreateQueueCommand.
    this.#logger.info(`Creating queue '${queueName}'...`);
    const createQueueCommand = new CreateQueueCommand({
      QueueName: queueName,
      Attributes: attributes,
      Tags: tags,
    });

    // Send command.
    const response = await this.#sqsClient.send(createQueueCommand);
    this.#logger.info(`Created queue '${queueName}'.`);
    this.#logger.debug(response);

    // Update state.
    this.#queueName = queueName;
    this.#queueUrl = response.QueueUrl;

    return this;
  }

  async delete() {
    if (!this.#queueUrl) throw new Error('queue not yet initialized');

    this.#logger.info(`Deleting queue '${this.#queueName}'...`);

    const deleteQueueCommand = new DeleteQueueCommand({
      QueueUrl: this.#queueUrl,
    });

    const response = await this.#sqsClient.send(deleteQueueCommand);
    this.#logger.info(`Deleted queue '${this.#queueName}'.`);
    this.#logger.debug(response);

    this.#queueName = null;
    this.#queueUrl = null;
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
