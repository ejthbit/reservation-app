### Running in local set in vite.config.js

```
external: `http://127.0.0.1:5001/assets/app.js`,
```

`sudo yarn run:mfe`

### Building production version set origin in vite.config.js

```
external: `../../app.js`, // root/assets/app.js
```

`sudo yarn build`
