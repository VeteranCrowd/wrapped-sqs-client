# WrappedApi

This package wraps an [Axios](https://axios-http.com/docs/intro) instance to
provide consistent logging and other services. See
[Confluence](https://veterancrowdnetwork.atlassian.net/wiki/spaces/TECH/pages/5047157/WrappedApi)
for more info.

# API Documentation

## Classes

<dl>
<dt><a href="#WrappedApi">WrappedApi</a></dt>
<dd><p>Wraps an Axios instance to provide standard services.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#WrappedApiError">WrappedApiError</a> : <code>object</code></dt>
<dd><p>WrappedApi error object.</p>
</dd>
<dt><a href="#WrappedApiResponse">WrappedApiResponse</a> : <code>object</code></dt>
<dd><p>WrappedApi response object.</p>
</dd>
</dl>

<a name="WrappedApiError"></a>

## WrappedApiError : <code>object</code>
WrappedApi error object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [error] | <code>string</code> | Axios error message. |
| [response] | <code>object</code> | Received HTTP response. |
| [response.status] | <code>number</code> | Response status code. |
| [response.headers] | <code>object</code> | Selected response headers. |
| [response.data] | <code>object</code> | Response body. |
| [request] | <code>object</code> | HTTP request body. |

<a name="WrappedApiResponse"></a>

## WrappedApiResponse : <code>object</code>
WrappedApi response object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [response] | <code>object</code> | Received HTTP response. |
| [response.status] | <code>number</code> | Response status code. |
| [response.statusText] | <code>string</code> | Response status text. |
| [response.headers] | <code>object</code> | Selected response headers. |
| [response.data] | <code>object</code> | Response body. |


---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
