# WrappedQueue

This package wraps an [AWS SQS](https://aws.amazon.com/sqs/) queue to provide consistent logging and other services. See [Confluence](https://veterancrowdnetwork.atlassian.net/wiki/spaces/TECH/pages/5079369/Library) for more info.

# API Documentation

<a name="module_WrappedQueue"></a>

## WrappedQueue

* [WrappedQueue](#module_WrappedQueue)
    * [.WrappedQueue](#module_WrappedQueue.WrappedQueue)
        * [new exports.WrappedQueue([options])](#new_module_WrappedQueue.WrappedQueue_new)
        * [.queueName](#module_WrappedQueue.WrappedQueue+queueName) ⇒ <code>string</code>
        * [.queueUrl](#module_WrappedQueue.WrappedQueue+queueUrl) ⇒ <code>string</code>
        * [.create(queueName, [attributes], [tags])](#module_WrappedQueue.WrappedQueue+create) ⇒ <code>Promise.&lt;WrappedQueue&gt;</code>

<a name="module_WrappedQueue.WrappedQueue"></a>

### WrappedQueue.WrappedQueue
Wraps an AWS SQS queue to provide standard logging & services.

**Kind**: static class of [<code>WrappedQueue</code>](#module_WrappedQueue)  

* [.WrappedQueue](#module_WrappedQueue.WrappedQueue)
    * [new exports.WrappedQueue([options])](#new_module_WrappedQueue.WrappedQueue_new)
    * [.queueName](#module_WrappedQueue.WrappedQueue+queueName) ⇒ <code>string</code>
    * [.queueUrl](#module_WrappedQueue.WrappedQueue+queueUrl) ⇒ <code>string</code>
    * [.create(queueName, [attributes], [tags])](#module_WrappedQueue.WrappedQueue+create) ⇒ <code>Promise.&lt;WrappedQueue&gt;</code>

<a name="new_module_WrappedQueue.WrappedQueue_new"></a>

#### new exports.WrappedQueue([options])
WrappedQueue constructor.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | Options. |
| [options.logger] | <code>object</code> | Logger instance. |
| [options.config] | <code>object</code> | [SQSClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sqsclientconfig.html). |

<a name="module_WrappedQueue.WrappedQueue+queueName"></a>

#### wrappedQueue.queueName ⇒ <code>string</code>
Gets the queue name.

**Kind**: instance property of [<code>WrappedQueue</code>](#module_WrappedQueue.WrappedQueue)  
**Returns**: <code>string</code> - Queue name.  
<a name="module_WrappedQueue.WrappedQueue+queueUrl"></a>

#### wrappedQueue.queueUrl ⇒ <code>string</code>
Gets the queue URL.

**Kind**: instance property of [<code>WrappedQueue</code>](#module_WrappedQueue.WrappedQueue)  
**Returns**: <code>string</code> - Queue URL.  
<a name="module_WrappedQueue.WrappedQueue+create"></a>

#### wrappedQueue.create(queueName, [attributes], [tags]) ⇒ <code>Promise.&lt;WrappedQueue&gt;</code>
Creates a new queue.

**Kind**: instance method of [<code>WrappedQueue</code>](#module_WrappedQueue.WrappedQueue)  
**Returns**: <code>Promise.&lt;WrappedQueue&gt;</code> - This instance.  

| Param | Type | Description |
| --- | --- | --- |
| queueName | <code>string</code> | Queue name. |
| [attributes] | <code>object</code> | [CreateQueueCommandInput attributes](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#attributes) |
| [tags] | <code>object</code> | [CreateQueueCommandInput tags](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#tags) |


---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
