//Modules
const express = require('express'),
    bunyan = require('bunyan'),
    bodyParser = require('body-parser'),
    fetch = require("node-fetch");
    axios = require('axios');

//Load values from .env file
require('dotenv').config();

const uuid = require('uuid');

const app = express();
const log = bunyan.createLogger({ name: 'Authorization Code Flow' });

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

//Set 1: Ask the authorization code
app.get('/get/the/code', async (req, res) => {

    const Authorization_Endpoint = `${process.env.AUTHN_HOST}/oauth/authorize`;
    const Response_Type = 'code';
    const Client_Id = process.env.CLIENT_ID;
    const Redirect_Uri_Default = `http://${process.env.LOCAL_DOMAIN}:8000/give/me/the/code`;
    const Scope = process.env.SCOPE;
    const State = `${uuid.v1()}`;

    log.info("redirect: " + process.env.REDIRECT_OVERRIDE)

    if (process.env.REDIRECT_OVERRIDE === undefined) {
        Redirect_Uri = Redirect_Uri_Default;
    }else {
        Redirect_Uri = process.env.REDIRECT_OVERRIDE;
    }

    let url = `${Authorization_Endpoint}?response_type=${Response_Type}&client_id=${Client_Id}&redirect_uri=${Redirect_Uri}&scope=${Scope}&state=${State}&groups_hint=${process.env.GROUPS_HINT}&login_hint=${process.env.LOGIN_HINT}&access_type=${process.env.ACCESS_TYPE}`;

    log.info(url);

    const headers = {
        'User-Identity-Forward-msisdn': process.env.NETWORK_MSISDN,
    };

    try {
        const respnse = await axios.get(url, { headers });

        res.status(respnse.status).send(respnse.data);
    } catch (error) {
        console.error('redirect error:', error.message);
        res.status(500).send('redirect error');
    }

    // res.redirect(url);

});

//Step 2: Get the code from the URL
app.get('/give/me/the/code', (req, res) => {
    const Logout_Endpoint = `${process.env.AUTHN_HOST}/oauth/logout`;
    const Client_Id = process.env.CLIENT_ID;

    _logout = `${Logout_Endpoint}?continue=${encodeURIComponent(`http://${process.env.LOCAL_DOMAIN}:8000`)}&client_id=${Client_Id}`;
    //before continue, you should check that req.query.state is the same that the state you sent
    res.render('exchange-code', { code: req.query.code, state: req.query.state, logout: _logout});
});

//Step 3: Exchange the code for a token
app.post('/exchange/the/code/for/a/token', (req, res) => {

    const Token_Endpoint = `${process.env.AUTHN_HOST}/oauth/token`;
    const Grant_Type = 'authorization_code';
    const Code = req.body.code;
    const Redirect_Uri = `http://${process.env.LOCAL_DOMAIN}:8000/give/me/the/code`;
    const Client_Id = process.env.CLIENT_ID;
    const Client_Secret = process.env.CLIENT_SECRET;
    const Scope = process.env.SCOPE;

    // let body = `grant_type=${Grant_Type}&code=${Code}&redirect_uri=${encodeURIComponent(Redirect_Uri)}&client_id=${Client_Id}&client_secret=${Client_Secret}&scope=${encodeURIComponent(Scope)}`;
    let body = `grant_type=${Grant_Type}&code=${Code}&redirect_uri=${encodeURIComponent(Redirect_Uri)}&client_id=${Client_Id}&client_secret=${Client_Secret}`;

    log.info(`Body: ${body}`);

    fetch(Token_Endpoint, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(async response => {

        const Logout_Endpoint = `${process.env.AUTHN_HOST}/oauth/logout`;
        const Client_Id = process.env.CLIENT_ID;
    
        _logout = `${Logout_Endpoint}?continue=${encodeURIComponent(`http://${process.env.LOCAL_DOMAIN}:8000`)}&client_id=${Client_Id}`;
    
        let json = await response.json();
        res.render('access-token', { logout: _logout, token: JSON.stringify(json, undefined, 2) }); //you shouldn't share the access token with the client-side

    }).catch(error => {
        log.error(error.message);
    });
});

//Step 4: Call the protected API
app.post('/call/mas-stack', (req, res) => {

    let access_token = JSON.parse(req.body.token).access_token;

    const Mas_stack_Endpoint = `${process.env.API_MAS_STACK}`;

    //Call Mas-stack with your access token
    fetch(`${Mas_stack_Endpoint}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }).then(async response => {

        let json = await response.json();
        res.render('calling-ms-graph', { response: JSON.stringify(json, undefined, 2) });
    });
});

app.listen(process.env.PORT || 8000);