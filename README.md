# Stock ticker service

API that returns stock ticker prices from Bitfinex.

# Prerequisites
- Node.js >= 10.2.0
- Docker

# Installation
This is node.js app.

In the terminal from the root of your app you can install it with:

```sh 
npm install
```

# Environment variables
Put the environment variables in `.env` config file.

You can use the sample:

```sh 
cp .env.sample .env
```

# Usage
Run your app with:
```sh 
./server.sh
```

## REST
GET all tickers:
```
curl -X GET http://{host}:{port}/tickers
```

GET ticker:
```
curl -X GET http://{host}:{port}/tickers/:ticker
```

Example:
```
curl -X GET http://localhost:3000/tickers/tETHBTC
```

## Websockets

Connect to {host}:{port}/ws (Example: localhost:3000/ws)

Send the following message to subscribe:
```
{"event": "subscribe", "symbol": "{symbol}"}
```

Send the following message to unsubscribe:
```
{"event": "unsubscribe", "symbol": "{symbol}"}
```

Example message:
```
{"event": "subscribe", "symbol": "tETHBTC"}
```

# Development
> This section is for individuals developing the Stock ticker and not intended for end-users.

## Sample Development Workflow

Clone this repository

From the root of your project run `npm install`

Run `npm test` to see unit test suite test results

Start doing your code changes

Make sure the test suite is still working after code changes

## Run tests
Run the following command to do this:
```sh
npm test
```

## Contributing 

This project is open source. Please consider forking this project to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request.

# License

MIT License

Copyright (c) 2018 Vladimir Trifonov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
