# WrappedSqsClient

This package wraps the [SQS Client - AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/index.html) to provide consistent logging and other services.

# API Documentation

<a name="module_WrappedSqsClient"></a>

## WrappedSqsClient

* [WrappedSqsClient](#module_WrappedSqsClient)
    * _static_
        * [.WrappedSqsClient](#module_WrappedSqsClient.WrappedSqsClient)
            * [new exports.WrappedSqsClient([options])](#new_module_WrappedSqsClient.WrappedSqsClient_new)
            * _instance_
                * [.queueInitialized](#module_WrappedSqsClient.WrappedSqsClient+queueInitialized) ⇒ <code>boolean</code>
                * [.queueName](#module_WrappedSqsClient.WrappedSqsClient+queueName) ⇒ <code>string</code>
                * [.queueUrl](#module_WrappedSqsClient.WrappedSqsClient+queueUrl) ⇒ <code>string</code>
                * [.createQueue(queueName, [attributes], [tags])](#module_WrappedSqsClient.WrappedSqsClient+createQueue) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
                * [.deleteQueue()](#module_WrappedSqsClient.WrappedSqsClient+deleteQueue) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
                * [.getQueue(queueName)](#module_WrappedSqsClient.WrappedSqsClient+getQueue) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
                * [.purgeQueue()](#module_WrappedSqsClient.WrappedSqsClient+purgeQueue) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
                * [.queueExists(queueName)](#module_WrappedSqsClient.WrappedSqsClient+queueExists) ⇒ <code>Promise.&lt;boolean&gt;</code>
                * [.receiveMessages([options])](#module_WrappedSqsClient.WrappedSqsClient+receiveMessages) ⇒ <code>Promise.&lt;Array.&lt;{messageId: string, body: any, attributes: Object.&lt;string, string&gt;}&gt;&gt;</code>
                * [.sendMessage(options)](#module_WrappedSqsClient.WrappedSqsClient+sendMessage)
            * _static_
                * [.decodeMessageAttributes(attributes)](#module_WrappedSqsClient.WrappedSqsClient.decodeMessageAttributes) ⇒ <code>DecodedMessageAttributes</code>
                * [.encodeMessageAttributes(attributes)](#module_WrappedSqsClient.WrappedSqsClient.encodeMessageAttributes) ⇒ <code>EncodedMessageAttributes</code>
    * _inner_
        * [~defaultClientConfig](#module_WrappedSqsClient..defaultClientConfig) : <code>SQSClientConfig</code>
        * [~DecodedMessageAttributes](#module_WrappedSqsClient..DecodedMessageAttributes) : <code>Object.&lt;string, (string\|number)&gt;</code>
        * [~EncodedMessageAttributes](#module_WrappedSqsClient..EncodedMessageAttributes) : <code>Object.&lt;string, MessageAttributeValue&gt;</code>

<a name="module_WrappedSqsClient.WrappedSqsClient"></a>

### WrappedSqsClient.WrappedSqsClient
Wraps an AWS SQS client to provide standard logging & services.

**Kind**: static class of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient)  

* [.WrappedSqsClient](#module_WrappedSqsClient.WrappedSqsClient)
    * [new exports.WrappedSqsClient([options])](#new_module_WrappedSqsClient.WrappedSqsClient_new)
    * _instance_
        * [.queueInitialized](#module_WrappedSqsClient.WrappedSqsClient+queueInitialized) ⇒ <code>boolean</code>
        * [.queueName](#module_WrappedSqsClient.WrappedSqsClient+queueName) ⇒ <code>string</code>
        * [.queueUrl](#module_WrappedSqsClient.WrappedSqsClient+queueUrl) ⇒ <code>string</code>
        * [.createQueue(queueName, [attributes], [tags])](#module_WrappedSqsClient.WrappedSqsClient+createQueue) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
        * [.deleteQueue()](#module_WrappedSqsClient.WrappedSqsClient+deleteQueue) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
        * [.getQueue(queueName)](#module_WrappedSqsClient.WrappedSqsClient+getQueue) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
        * [.purgeQueue()](#module_WrappedSqsClient.WrappedSqsClient+purgeQueue) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
        * [.queueExists(queueName)](#module_WrappedSqsClient.WrappedSqsClient+queueExists) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.receiveMessages([options])](#module_WrappedSqsClient.WrappedSqsClient+receiveMessages) ⇒ <code>Promise.&lt;Array.&lt;{messageId: string, body: any, attributes: Object.&lt;string, string&gt;}&gt;&gt;</code>
        * [.sendMessage(options)](#module_WrappedSqsClient.WrappedSqsClient+sendMessage)
    * _static_
        * [.decodeMessageAttributes(attributes)](#module_WrappedSqsClient.WrappedSqsClient.decodeMessageAttributes) ⇒ <code>DecodedMessageAttributes</code>
        * [.encodeMessageAttributes(attributes)](#module_WrappedSqsClient.WrappedSqsClient.encodeMessageAttributes) ⇒ <code>EncodedMessageAttributes</code>

<a name="new_module_WrappedSqsClient.WrappedSqsClient_new"></a>

#### new exports.WrappedSqsClient([options])
WrappedSqsClient constructor.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | Options. |
| [options.logger] | <code>object</code> | Logger instance (default is [global console object](https://nodejs.org/api/console.html#class-console)). Must have info, error & debug methods |
| [options.logInternals] | <code>boolean</code> | Log SQS client internals (default is false). |
| [options.config] | <code>SQSClientConfig</code> | [SQSClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sqsclientconfig.html). |

<a name="module_WrappedSqsClient.WrappedSqsClient+queueInitialized"></a>

#### wrappedSqsClient.queueInitialized ⇒ <code>boolean</code>
Returns true if queue has been initialized.

**Kind**: instance property of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>boolean</code> - True if the queue has been initialized.  
<a name="module_WrappedSqsClient.WrappedSqsClient+queueName"></a>

#### wrappedSqsClient.queueName ⇒ <code>string</code>
Gets queue name.

**Kind**: instance property of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>string</code> - Queue name.  
<a name="module_WrappedSqsClient.WrappedSqsClient+queueUrl"></a>

#### wrappedSqsClient.queueUrl ⇒ <code>string</code>
Gets the queue URL.

**Kind**: instance property of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>string</code> - Queue URL.  
<a name="module_WrappedSqsClient.WrappedSqsClient+createQueue"></a>

#### wrappedSqsClient.createQueue(queueName, [attributes], [tags]) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
Creates a new queue.

**Kind**: instance method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>Promise.&lt;WrappedSqsClient&gt;</code> - [WrappedSqsClient](WrappedSqsClient) instance.  

| Param | Type | Description |
| --- | --- | --- |
| queueName | <code>string</code> | Queue name |
| [attributes] | <code>Object.&lt;string, string&gt;</code> | [CreateQueueCommandInput attributes](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#attributes) |
| [tags] | <code>Object.&lt;string, string&gt;</code> | [CreateQueueCommandInput tags](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#tags) |

<a name="module_WrappedSqsClient.WrappedSqsClient+deleteQueue"></a>

#### wrappedSqsClient.deleteQueue() ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
Deletes a queue.

**Kind**: instance method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>Promise.&lt;WrappedSqsClient&gt;</code> - [WrappedSqsClient](WrappedSqsClient) instance.  
<a name="module_WrappedSqsClient.WrappedSqsClient+getQueue"></a>

#### wrappedSqsClient.getQueue(queueName) ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
Get existing queue by name.

**Kind**: instance method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>Promise.&lt;WrappedSqsClient&gt;</code> - WrappedSqsClient instance.  

| Param | Type | Description |
| --- | --- | --- |
| queueName | <code>string</code> | Queue name. |

<a name="module_WrappedSqsClient.WrappedSqsClient+purgeQueue"></a>

#### wrappedSqsClient.purgeQueue() ⇒ <code>Promise.&lt;WrappedSqsClient&gt;</code>
Purge queue.

**Kind**: instance method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>Promise.&lt;WrappedSqsClient&gt;</code> - WrappedSqsClient instance.  
<a name="module_WrappedSqsClient.WrappedSqsClient+queueExists"></a>

#### wrappedSqsClient.queueExists(queueName) ⇒ <code>Promise.&lt;boolean&gt;</code>
Test queue existence by name.

**Kind**: instance method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if queue exists.  

| Param | Type | Description |
| --- | --- | --- |
| queueName | <code>string</code> | Queue name. |

<a name="module_WrappedSqsClient.WrappedSqsClient+receiveMessages"></a>

#### wrappedSqsClient.receiveMessages([options]) ⇒ <code>Promise.&lt;Array.&lt;{messageId: string, body: any, attributes: Object.&lt;string, string&gt;}&gt;&gt;</code>
Receive queue messages.

**Kind**: instance method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>Promise.&lt;Array.&lt;{messageId: string, body: any, attributes: Object.&lt;string, string&gt;}&gt;&gt;</code> - Array of messages.  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | Options. |
| [options.limit] | <code>number</code> | Maximum number of messages to receive. |

<a name="module_WrappedSqsClient.WrappedSqsClient+sendMessage"></a>

#### wrappedSqsClient.sendMessage(options)
Sends a message.

**Kind**: instance method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options. |
| [options.delaySeconds] | <code>number</code> | Delay in seconds. |
| [options.attributes] | <code>DecodedMessageAttributes</code> | [Message attributes.](DecodedMessageAttributes) |
| options.body | <code>\*</code> | [SendMessageCommandInput messageBody](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagebody). Must be a string or a JSON-serializable object. |
| [options.deduplicationId] | <code>string</code> | [SendMessageCommandInput messageDeduplicationId](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagededuplicationid) |
| [options.groupId] | <code>string</code> | [SendMessageCommandInput messageGroupId](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagegroupid) |
| [options.systemAttributes] | <code>DecodedMessageAttributes</code> | [SendMessageCommandInput messageSystemAttributes](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html#messagesystemattributes) |

<a name="module_WrappedSqsClient.WrappedSqsClient.decodeMessageAttributes"></a>

#### WrappedSqsClient.decodeMessageAttributes(attributes) ⇒ <code>DecodedMessageAttributes</code>
Decode message attributes from SQS.

**Kind**: static method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>DecodedMessageAttributes</code> - Decoded message attributes.  

| Param | Type | Description |
| --- | --- | --- |
| attributes | <code>EncodedMessageAttributes</code> | Encoded message attributes. |

<a name="module_WrappedSqsClient.WrappedSqsClient.encodeMessageAttributes"></a>

#### WrappedSqsClient.encodeMessageAttributes(attributes) ⇒ <code>EncodedMessageAttributes</code>
Encode message attributes for SQS.

**Kind**: static method of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient.WrappedSqsClient)  
**Returns**: <code>EncodedMessageAttributes</code> - Encoded message attributes.  

| Param | Type | Description |
| --- | --- | --- |
| attributes | <code>DecodedMessageAttributes</code> | Decoded message attributes. |

<a name="module_WrappedSqsClient..defaultClientConfig"></a>

### WrappedSqsClient~defaultClientConfig : <code>SQSClientConfig</code>
**Kind**: inner constant of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient)  
<a name="module_WrappedSqsClient..DecodedMessageAttributes"></a>

### WrappedSqsClient~DecodedMessageAttributes : <code>Object.&lt;string, (string\|number)&gt;</code>
**Kind**: inner typedef of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient)  
<a name="module_WrappedSqsClient..EncodedMessageAttributes"></a>

### WrappedSqsClient~EncodedMessageAttributes : <code>Object.&lt;string, MessageAttributeValue&gt;</code>
**Kind**: inner typedef of [<code>WrappedSqsClient</code>](#module_WrappedSqsClient)  

---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
