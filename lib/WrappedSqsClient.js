/**
 * @module WrappedSqsClient
 */

// npm imports
import sqsClient from '@aws-sdk/client-sqs';
const { MessageAttributeValue, SQS, SQSClientConfig } = sqsClient;

import _ from 'lodash';

/**
 * @typedef {Object<string, string|number>} DecodedMessageAttributes
 */

/**
 * @typedef {Object<string, MessageAttributeValue>} EncodedMessageAttributes
 */

/** @type {SQSClientConfig} */
const defaultClientConfig = { region: 'us-east-1' };

/**
 * Wraps an AWS SQS client to provide standard logging & services.
 */
export class WrappedSqsClient {
  #client;
  #logger;
  #queueName;
  #queueUrl;

  /**
   * WrappedSqsClient constructor.
   *
   * @param {object} [options] - Options.
   * @param {object} [options.logger] - Logger instance (default is {@link https://nodejs.org/api/console.html#class-console global console object}). Must have info, error & debug methods
   * @param {boolean} [options.logInternals] - Log AWS client internals (default is false).
   * @param {SQSClientConfig} [options.config] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sqsclientconfig.html SQSClientConfig}.
   */
  constructor({
    config = defaultClientConfig,
    logger = console,
    logInternals = false,
  } = {}) {
    // Validate options.
    if (!logger.info || !logger.error || !logger.debug)
      throw new Error('logger must have info, error & debug methods');

    // Set state.
    this.#logger = logger;
    this.#client = new SQS({
      ..._.omit(config, 'logger'),
      ...(logInternals ? { logger } : {}),
    });
  }

  /**
   * Decode message from SQS.
   *
   * @param {object} [message] - Encoded message.
   * @return {object} Decoded message.
   */
  static decodeMessage(message = {}) {
    const {
      Body,
      body,
      MessageAttributes,
      messageAttributes,
      MessageId,
      messageId,
      ReceiptHandle,
      receiptHandle,
    } = message;
    const theBody = Body ?? body;
    const theMessageAttributes = MessageAttributes ?? messageAttributes;
    const theMessageId = MessageId ?? messageId;
    const theReceiptHandle = ReceiptHandle ?? receiptHandle;

    try {
      var decodedBody = JSON.parse(theBody);
    } catch {
      decodedBody = theBody;
    }

    return {
      attributes:
        WrappedSqsClient.decodeMessageAttributes(theMessageAttributes),
      body: decodedBody,
      messageId: theMessageId,
      receiptHandle: theReceiptHandle,
    };
  }

  /**
   * Decode message attributes from SQS.
   *
   * @param {EncodedMessageAttributes} attributes - Encoded message attributes.
   * @return {DecodedMessageAttributes} Decoded message attributes.
   */
  static decodeMessageAttributes(attributes = {}) {
    return _.mapValues(
      attributes,
      ({ DataType, dataType, StringValue, stringValue }) => {
        const theDataType = DataType ?? dataType;
        const theStringValue = StringValue ?? stringValue;

        switch (theDataType) {
          case 'String':
            return theStringValue;
          case 'Number':
            return Number(theStringValue);
          default:
            throw new Error(`unsupported attribute value type: ${theDataType}`);
        }
      }
    );
  }

  /**
   * Encode message attributes for SQS.
   *
   * @param {DecodedMessageAttributes} attributes - Decoded message attributes.
   * @return {EncodedMessageAttributes} Encoded message attributes.
   */
  static encodeMessageAttributes(attributes = {}) {
    return _.mapValues(attributes, (attribute) => ({
      DataType: _.isString(attribute)
        ? 'String'
        : _.isNumber(attribute)
        ? 'Number'
        : (() => {
            throw new Error(
              `unsupported attribute value type: ${typeof attribute}`
            );
          })(),
      StringValue: attribute.toString(),
    }));
  }

  /**
   * Get queue url by name.
   *
   * @private
   * @param {string} name - Queue name.
   * @return {Promise<string|undefined>} Queue url or undefined if not found.
   */
  async #getQueueUrl(name) {
    // Validate params.
    if (!name) throw new Error('name is required');

    // Send command.
    this.#logger.debug(`Resolving queue name '${name}' to url...`);
    try {
      const response = await this.#client.getQueueUrl({
        QueueName: name,
      });
      this.#logger.debug(`Resolved to '${response.QueueUrl}'.`);
      this.#logger.debug(response);
      return response.QueueUrl;
    } catch (error) {
      this.#logger.error(`Resolution failed.`);
      this.#logger.debug(error);
      return undefined;
    }
  }

  /**
   * Returns true if queue has been initialized.
   *
   * @return {boolean} True if the queue has been initialized.
   */
  get queueInitialized() {
    return !!this.#queueUrl;
  }

  /**
   * Gets queue name.
   *
   * @return {string} Queue name.
   */
  get queueName() {
    return this.#queueName;
  }

  /**
   * Gets the queue URL.
   *
   * @return {string} Queue URL.
   */
  get queueUrl() {
    return this.#queueUrl;
  }

  /**
   * Creates a new queue.
   *
   * @param {string} queueName - Queue name
   * @param {Object<string, string>} [attributes] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#attributes CreateQueueCommandInput attributes}
   * @param {Object<string, string>} [tags] {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#tags CreateQueueCommandInput tags}
   * @return {Promise<WrappedSqsClient>} {@link WrappedSqsClient} instance.
   */
  async createQueue(queueName, attributes, tags) {
    // Validate parameters.
    if (!queueName) throw new Error('queueName is required');

    // Send command.
    this.#logger.info(`Creating queue '${queueName}'...`);
    const response = await this.#client.createQueue({
      QueueName: queueName,
      Attributes: attributes,
      Tags: tags,
    });
    this.#logger.info(`Created queue '${queueName}'.`);
    this.#logger.debug(response);

    // Update state.
    this.#queueName = queueName;
    this.#queueUrl = response.QueueUrl;

    return this;
  }

  /**
   * Deletes a queue.
   *
   * @return {Promise<WrappedSqsClient>} {@link WrappedSqsClient} instance.
   */
  async deleteQueue() {
    // Validate state.
    if (!this.queueInitialized) throw new Error('queue not yet initialized');

    // Send command.
    this.#logger.info(`Deleting queue '${this.#queueName}'...`);
    const response = await this.#client.deleteQueue({
      QueueUrl: this.#queueUrl,
    });
    this.#logger.info(`Deleted queue '${this.#queueName}'.`);
    this.#logger.debug(response);

    // Update state.
    this.#queueName = undefined;
    this.#queueUrl = undefined;

    return this;
  }

  /**
   * Deletes a message batch.
   *
   * @param {object[]} messages - Messages to delete.
   * @return {Promise<WrappedSqsClient>} {@link WrappedSqsClient} instance.
   */
  async deleteMessageBatch(messages) {
    // Validate state.
    if (!this.queueInitialized) throw new Error('queue not yet initialized');

    // Send command.
    this.#logger.debug(
      `Deleting message batch from queue '${this.#queueName}'...`,
      messages
    );
    const response = await this.#client.deleteMessageBatch({
      QueueUrl: this.#queueUrl,
      Entries: messages.map(({ messageId, receiptHandle }) => ({
        Id: messageId,
        ReceiptHandle: receiptHandle,
      })),
    });
    this.#logger.debug(`Deleted message batch.`, response);

    return this;
  }

  /**
   * Get existing queue by name.
   *
   * @param {string} queueName - Queue name.
   * @return {Promise<WrappedSqsClient>} WrappedSqsClient instance.
   */
  async getQueue(queueName) {
    // Get queue url.
    const url = await this.#getQueueUrl(queueName);

    if (!url) throw new Error(`queue '${queueName}' not found`);

    this.#queueName = queueName;
    this.#queueUrl = url;

    return this;
  }

  /**
   * Purge queue.
   *
   * @return {Promise<WrappedSqsClient>} WrappedSqsClient instance.
   */
  async purgeQueue() {
    // Validate state.
    if (!this.queueInitialized) throw new Error('queue not yet initialized');

    // Send command.
    this.#logger.info(`Purging queue '${this.#queueName}'...`);
    const response = await this.#client.purgeQueue({
      QueueUrl: this.#queueUrl,
    });
    this.#logger.info(`Purged.`);
    this.#logger.debug(response);

    return this;
  }

  /**
   * Test queue existence by name.
   *
   * @param {string} queueName - Queue name.
   * @return {Promise<boolean>} True if queue exists.
   */
  async queueExists(queueName) {
    return !!(await this.#getQueueUrl(queueName));
  }

  /**
   * Receive queue messages.
   *
   * @param {object} [options] - Options.
   * @param {number} [options.limit] - Maximum number of messages to receive.
   * @return {Promise<Array<{ messageId: string, body: any, attributes: Object<string, string> }>>} Array of messages.
   */
  async receiveMessages({ limit = 1 } = {}) {
    // Validate state.
    if (!this.queueInitialized) throw new Error('queue not yet initialized');

    // Send command.
    this.#logger.debug(
      `Retrieving messages from queue '${this.#queueName}'...`
    );
    const response = await this.#client.receiveMessage({
      MaxNumberOfMessages: limit,
      MessageAttributeNames: ['All'],
      QueueUrl: this.#queueUrl,
    });
    const messages = response.Messages
      ? response.Messages.map((message) =>
          this.constructor.decodeMessage(message)
        )
      : [];
    this.#logger.debug(`Retrieved ${messages.length} messages.`);
    this.#logger.debug(messages);

    return messages;
  }

  /**
   * Sends a message.
   *
   * @param {object} options - Options.
   * @param {DecodedMessageAttributes} [options.attributes] - {@link DecodedMessageAttributes Message attributes.}
   * @param {*} options.body - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagebody SendMessageCommandInput messageBody}. Must be a string or a JSON-serializable object.
   * @param {string} [options.deduplicationId] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagededuplicationid SendMessageCommandInput messageDeduplicationId}
   * @param {number} [options.delaySeconds] - Delay in seconds.
   * @param {string} [options.groupId] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagegroupid SendMessageCommandInput messageGroupId}
   * @param {DecodedMessageAttributes} [options.systemAttributes] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagesystemattributes SendMessageCommandInput messageSystemAttributes}
   * @return {Promise<WrappedSqsClient>} WrappedSqsClient instance.
   */
  async sendMessage({
    attributes,
    body,
    deduplicationId,
    delaySeconds,
    groupId,
    systemAttributes,
  }) {
    // Validate state.
    if (!this.queueInitialized) throw new Error('queue not yet initialized');

    // Validate arguments.
    if (!body) throw new Error('body is required');

    // Send command.
    const message = {
      DelaySeconds: delaySeconds,
      MessageAttributes: this.constructor.encodeMessageAttributes(attributes),
      MessageBody: _.isString(body) ? body : JSON.stringify(body),
      MessageDeduplicationId: deduplicationId,
      MessageGroupId: groupId,
      MessageSystemAttributes:
        this.constructor.encodeMessageAttributes(systemAttributes),
      QueueUrl: this.#queueUrl,
    };
    this.#logger.debug(
      `Sending message to queue '${this.#queueName}'...`,
      message
    );

    const response = await this.#client.sendMessage(message);
    this.#logger.debug(`Sent message.`, response);

    return this;
  }

  /**
   * @typedef {object} SendMessageBatchRequestEntry
   * @property {DecodedMessageAttributes} [attributes] - {@link DecodedMessageAttributes Message attributes.}
   * @property {*} body - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagebody SendMessageCommandInput messageBody}. Must be a string or a JSON-serializable object.
   * @param {string} [deduplicationId] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagededuplicationid SendMessageCommandInput messageDeduplicationId}
   * @param {number} [delaySeconds] - Delay in seconds.
   * @param {string} [groupId] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagegroupid SendMessageCommandInput messageGroupId}
   * @param {string} id - Message ID.
   * @param {DecodedMessageAttributes} [systemAttributes] - {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagesystemattributes SendMessageCommandInput messageSystemAttributes}
   */

  /**
   * Sends a message batch.
   *
   * @param {SendMessageBatchRequestEntry[]} entries - Entries.
   * @return {Promise<WrappedSqsClient>} WrappedSqsClient instance.
   */
  async sendMessageBatch(entries) {
    // Validate state.
    if (!this.queueInitialized) throw new Error('queue not yet initialized');

    // Validate arguments.
    if (!Array.isArray(entries)) throw new Error('entries must be an array');
    for (const { body, id } of entries) {
      if (!body) throw new Error('body is required');
      if (!id) throw new Error('id is required');
    }

    // Send command.
    const batch = entries.map(
      ({
        attributes,
        body,
        deduplicationId,
        delaySeconds,
        groupId,
        id,
        systemAttributes,
      }) => ({
        DelaySeconds: delaySeconds,
        Id: id,
        MessageAttributes: this.constructor.encodeMessageAttributes(attributes),
        MessageBody: _.isString(body) ? body : JSON.stringify(body),
        MessageDeduplicationId: deduplicationId,
        MessageGroupId: groupId,
        MessageSystemAttributes:
          this.constructor.encodeMessageAttributes(systemAttributes),
        QueueUrl: this.#queueUrl,
      })
    );
    this.#logger.debug(
      `Sending message batch to queue '${this.#queueName}'...`,
      batch
    );

    const response = await this.#client.sendMessageBatch({
      QueueUrl: this.#queueUrl,
      Entries: batch,
    });
    this.#logger.debug(`Sent message batch.`, response);

    return this;
  }
}
