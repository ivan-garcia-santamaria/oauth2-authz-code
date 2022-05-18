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
Open http://localhost:8000 and do the flow.