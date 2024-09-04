# DEPLOY TO VPS
## CADDY
- sudo systemctl reload caddy
## SERVER
### FIRST TIME
```bash
tar cf - dist package.json package-lock.json prisma .env  | gzip -3 | ssh ertu.codes '
cd ~/hosts && mkdir reddit && cd reddit && gunzip | tar xf -'
```
- npm i --omit=dev
- npx prisma migrate dev
### OTHER TIMES
- (dont copy .env!!, dont create reddit folder, optionally dont copy other files)
```bash
tar cf - dist package.json package-lock.json prisma | gzip -3 | ssh ertu.codes '
cd ~/hosts &&  cd reddit && gunzip | tar xf -'
```
```env
DATABASE_URL=connectionstring
COOKIE_SECRET=cookiesecret
JWT_SECRET=jwtsecret
CLIENT_URL="https://reddit.ertu.codes"
HOST="127.0.0.1"
PORT="3001"
```
### VPS
- /etc/caddy/sites-available/reddit-server
```caddy
reddit-server.ertu.codes {
        reverse_proxy :3001
}
```
- sudo ln -s /etc/caddy/sites-available/reddit-server /etc/caddy/sites-enabled/reddit-server
- cd ~/hosts/reddit && pm2 start dist/app.js

## CLIENT
- cd /var/www && rm -r reddit.ertu.codes/*
- sudo -- su
- mkdir reddit.ertu.codes
- chown -R ubuntu:ubuntu reddit.ertu.codes
```bash
tar cf - build | gzip -3 | ssh ertu.codes '
  cd /var/www && mkdir reddit.ertu.codes && gunzip | tar xf - -C reddit.ertu.codes --strip-components=1' # maybe outdated
```

- cd /etc/caddy/sites-available
- sudo vim reddit-client
```caddy
reddit.ertu.codes {
        root * /var/www/reddit.ertu.codes

        file_server
        encode gzip

        try_files {path} /index.html
}
```
- sudo ln -s /etc/caddy/sites-available/reddit-client /etc/caddy/sites-enabled/reddit-client

