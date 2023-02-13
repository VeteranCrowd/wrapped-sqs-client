# WrappedQueue

This package wraps an [AWS SQS](https://aws.amazon.com/sqs/) queue to provide consistent logging and other services. See [Confluence](https://veterancrowdnetwork.atlassian.net/wiki/spaces/TECH/pages/5079369/Library) for more info.

# API Documentation

<a name="module_@veterancrowd/wrapped-queue"></a>

## @veterancrowd/wrapped-queue

* [@veterancrowd/wrapped-queue](#module_@veterancrowd\wrapped-queue)
    * [.WrappedQueue](#module_@veterancrowd\wrapped-queue.WrappedQueue)
        * [new exports.WrappedQueue([options])](#new_module_@veterancrowd/wrapped-queue.WrappedQueue_new)
        * [.queueName](#module_@veterancrowd\wrapped-queue.WrappedQueue+queueName) ⇒ <code>string</code>
        * [.queueUrl](#module_@veterancrowd\wrapped-queue.WrappedQueue+queueUrl) ⇒ <code>string</code>
        * [.create(queueName, [attributes], [tags])](#module_@veterancrowd/wrapped-queue.WrappedQueue+create) ⇒ <code>Promise.&lt;WrappedQueue&gt;</code>

<a name="module_@veterancrowd/wrapped-queue.WrappedQueue"></a>

### @veterancrowd/wrapped-queue.WrappedQueue
Wraps an AWS SQS queue to provide standard logging & services.

**Kind**: static class of [<code>@veterancrowd/wrapped-queue</code>](#module_@veterancrowd\wrapped-queue)  

* [.WrappedQueue](#module_@veterancrowd\wrapped-queue.WrappedQueue)
    * [new exports.WrappedQueue([options])](#new_module_@veterancrowd/wrapped-queue.WrappedQueue_new)
    * [.queueName](#module_@veterancrowd\wrapped-queue.WrappedQueue+queueName) ⇒ <code>string</code>
    * [.queueUrl](#module_@veterancrowd\wrapped-queue.WrappedQueue+queueUrl) ⇒ <code>string</code>
    * [.create(queueName, [attributes], [tags])](#module_@veterancrowd/wrapped-queue.WrappedQueue+create) ⇒ <code>Promise.&lt;WrappedQueue&gt;</code>

<a name="new_module_@veterancrowd/wrapped-queue.WrappedQueue_new"></a>

#### new exports.WrappedQueue([options])
WrappedQueue constructor.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | Options. |
| [options.logger] | <code>object</code> | Logger instance. |
| [options.config] | <code>object</code> | Queue config. |

<a name="module_@veterancrowd/wrapped-queue.WrappedQueue+queueName"></a>

#### wrappedQueue.queueName ⇒ <code>string</code>
Gets the queue name.

**Kind**: instance property of [<code>WrappedQueue</code>](#module_@veterancrowd\wrapped-queue.WrappedQueue)  
**Returns**: <code>string</code> - Queue name.  
<a name="module_@veterancrowd/wrapped-queue.WrappedQueue+queueUrl"></a>

#### wrappedQueue.queueUrl ⇒ <code>string</code>
Gets the queue URL.

**Kind**: instance property of [<code>WrappedQueue</code>](#module_@veterancrowd\wrapped-queue.WrappedQueue)  
**Returns**: <code>string</code> - Queue URL.  
<a name="module_@veterancrowd/wrapped-queue.WrappedQueue+create"></a>

#### wrappedQueue.create(queueName, [attributes], [tags]) ⇒ <code>Promise.&lt;WrappedQueue&gt;</code>
Creates a new queue.

**Kind**: instance method of [<code>WrappedQueue</code>](#module_@veterancrowd\wrapped-queue.WrappedQueue)  
**Returns**: <code>Promise.&lt;WrappedQueue&gt;</code> - This instance.  

| Param | Type | Description |
| --- | --- | --- |
| queueName | <code>string</code> | Queue name. |
| [attributes] | <code>object</code> | [CreateQueueCommandInput attributes](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#attributes) |
| [tags] | <code>object</code> | [CreateQueueCommandInput tags](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/createqueuecommandinput.html#tags) |


---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
