/**
 * @module WrappedSqsClient
 */

// npm imports
import {
  CreateQueueCommand,
  DeleteQueueCommand,
  GetQueueUrlCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import _ from 'lodash';

const defaultSQSClientConfig = { region: 'us-east-1' };

/**
 * Wraps an AWS SQS queue to provide standard logging & services.
 */
export class WrappedSqsClient {
  #logger;
  #name;
  #sqsClient;
  #url;

  /**
   * WrappedSqsClient constructor.
   *
   * @param {object} [options] - Options.
   * @param {object} [options.logger] - Logger instance (default is {@link https://nodejs.org/api/console.html#class-console global console object}).
   * @param {import('@aws-sdk/client-sqs').SQSClientConfig} [options.config] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sqsclientconfig.html SQSClientConfig}.
   */
  constructor({ logger = console, config = defaultSQSClientConfig } = {}) {
    this.#logger = logger;
    this.#sqsClient = new SQSClient(config);
  }

  /**
   * Get queue url by name.
   *
   * @param {string} name - Queue name.
   * @returns {Promise<string|undefined>} Queue url or undefined if not found.
   */
  async #getUrl(name) {
    // Validate params.
    if (!name) throw new Error('name is required');

    // Generate GetQueueUrlCommand.
    this.#logger.info(`Resolving queue name '${name}' to url...`);
    const getQueueUrlCommand = new GetQueueUrlCommand({
      QueueName: name,
    });

    // Send command.
    try {
      const response = await this.#sqsClient.send(getQueueUrlCommand);
      this.#logger.info(`Resolved to '${response.QueueUrl}'.`);
      this.#logger.debug(response);
      return response.QueueUrl;
    } catch (error) {
      this.#logger.info(`Resolution failed.`);
      this.#logger.debug(JSON.parse(JSON.stringify(error)));
      return undefined;
    }
  }

  /**
   * Returns true if the queue has been initialized.
   *
   * @returns {boolean} True if the queue has been initialized.
   */
  get isInitialized() {
    return !!this.#url;
  }

  /**
   * Gets the queue name.
   *
   * @returns {string} Queue name.
   */
  get name() {
    return this.#name;
  }

  /**
   * Gets the queue URL.
   *
   * @returns {string} Queue URL.
   */
  get url() {
    return this.#url;
  }

  /**
   * Creates a new queue.
   *
   * @param {string} name - Queue name
   * @param {Object<string, string>} [attributes] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#attributes CreateQueueCommandInput attributes}
   * @param {Object<string, string>} [tags] {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#tags CreateQueueCommandInput tags}
   * @returns {Promise<WrappedSqsClient>} {@link WrappedSqsClient} instance.
   */
  async create(name, attributes, tags) {
    // Validate state.
    if (this.isInitialized) throw new Error('queue already initialized');

    // Validate parameters.
    if (!name) throw new Error('name is required');

    // Generate CreateQueueCommand.
    this.#logger.info(`Creating queue '${name}'...`);
    const createQueueCommand = new CreateQueueCommand({
      QueueName: name,
      Attributes: attributes,
      Tags: tags,
    });

    // Send command.
    const response = await this.#sqsClient.send(createQueueCommand);
    this.#logger.info(`Created queue '${name}'.`);
    this.#logger.debug(response);

    // Update state.
    this.#name = name;
    this.#url = response.QueueUrl;

    return this;
  }

  /**
   * Deletes a queue.
   *
   * @returns {Promise<WrappedSqsClient>} {@link WrappedSqsClient} instance.
   */
  async delete() {
    // Validate state.
    if (!this.isInitialized) throw new Error('queue not yet initialized');

    // Generate DeleteQueueCommand.
    this.#logger.info(`Deleting queue '${this.#name}'...`);
    const deleteQueueCommand = new DeleteQueueCommand({
      QueueUrl: this.#url,
    });

    // Send command.
    const response = await this.#sqsClient.send(deleteQueueCommand);
    this.#logger.info(`Deleted queue '${this.#name}'.`);
    this.#logger.debug(response);

    // Update state.
    this.#name = undefined;
    this.#url = undefined;

    return this;
  }

  /**
   * Test queue existence by name.
   *
   * @param {string} name - Queue name.
   * @returns {Promise<boolean>} True if queue exists.
   */
  async exists(name) {
    return !!(await this.#getUrl(name));
  }

  /**
   * Get existing queue by name.
   *
   * @param {string} name - Queue name.
   * @returns {Promise<WrappedSqsClient>} WrappedSqsClient instance.
   */
  async get(name) {
    // Get queue url.
    const url = await this.#getUrl(name);

    if (!url) throw new Error(`queue '${name}' not found`);

    this.#name = name;
    this.#url = url;

    return this;
  }

  async purge() {
    if (!this.#url) throw new Error('queue not yet initialized');

    this.#logger.info(`Purging queue '${this.#name}'...`);

    const purgeQueueCommand = new PurgeQueueCommand({
      QueueUrl: this.#url,
    });

    const response = await this.#sqsClient.send(purgeQueueCommand);

    this.#logger.info(`Purged.`);
    this.#logger.debug(response);

    return response;
  }

  async receiveMessages({ limit = 1 } = {}) {
    if (!this.#url) throw new Error('queue not yet initialized');

    this.#logger.info(`Retrieving messages from queue '${this.#name}'...`);

    const receiveMessageCommand = new ReceiveMessageCommand({
      MaxNumberOfMessages: limit,
      MessageAttributeNames: ['.*'],
      QueueUrl: this.#url,
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
}
