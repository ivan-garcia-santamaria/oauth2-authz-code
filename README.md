# oauth2-authz-code

# Install node in Apple M1
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | zsh

source ~/.zshrc

nvm install v15

nvm cache clear

npm install express

npm install uuid
```
# Authn
Create a new app with its client with grant type authorization code with redirect-url: http://localhost:8000/give/me/the/code. And config this values in the `.env` file.

You can also decrypt the env.enc file as follows: `sops -d env.enc > .env`


# Environment
Create a `.env` file to set:
```
AUTHN_HOST={{authn-host}}
CLIENT_ID="{{client-id}}"
CLIENT_SECRET="{{client-secret}}"
API_MAS_STACK="{{mas-stack-api-endpoint}}"
``` 

For example:
```
AUTHN_HOST=authn.k8s.masmovil.com
CLIENT_ID="7PHCtk8CJ6qaWMlO1wbF"
CLIENT_SECRET="xwunvH5SkVbMdzgtwHv8-UpFZNJVltGA8d0VTLgJpJ4="
API_MAS_STACK="authn-admin.prod-01.k8s.masmovil.com/applications"
```


# Start server
`node server.js`

# Play
It has been configured so that the server starts up via an HTTPS port. The certificate is self-generated and created for the DN front.local, so if you want to avoid the browser warning that the certificate does not match the host name, you must include the following line in the /etc/hosts file:

127.0.0.1    localhost front.local

Open https://front.local:8443 and do the flow.