# Usage:

```
  - name: Cache mypy
    uses: kajalagroup/code-QA-cache-github-action@v1.7
    with:
      path: .mypy_cache
      key: mypy-cache
      restore-keys: mypy-cache

```

## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```


## Reference links:
- https://github.com/actions/cache
- https://github.com/AustinScola/mypy-cache-github-action