//Modules
const express = require('express'),
    bunyan = require('bunyan'),
    https = require('https'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    axios = require('axios');

const fetch = require('node-fetch').default;


//Load values from .env file
require('dotenv').config();

const uuid = require('uuid');

const app = express();
const log = bunyan.createLogger({ name: 'Authorization Code Flow' });

let client_id ="";
let client_secret ="";
let host ="";


app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('menu',{ device_code_local_client_id: process.env.DEVICE_CODE_LOCAL_CLIENT_ID,
        device_code_local_client_secret: process.env.DEVICE_CODE_LOCAL_CLIENT_SECRET,
        ciba_local_client_id: process.env.CIBA_LOCAL_CLIENT_ID, 
        ciba_local_client_secret: process.env.CIBA_LOCAL_CLIENT_SECRET, 
        ciba_masmovil_sta_client_id: process.env.CIBA_MASMOVIL_STA_CLIENT_ID, 
        ciba_masmovil_sta_client_secret: process.env.CIBA_MASMOVIL_STA_CLIENT_SECRET, 
        ciba_yoigo_sta_client_id: process.env.CIBA_YOIGO_STA_CLIENT_ID, 
        ciba_yoigo_sta_client_secret: process.env.CIBA_YOIGO_STA_CLIENT_SECRET, 
        ciba_yoigo_pro_client_id: process.env.CIBA_YOIGO_PRO_CLIENT_ID, 
        ciba_yoigo_pro_client_secret: process.env.CIBA_YOIGO_PRO_CLIENT_SECRET, 
        masmovil_pro_client_id: process.env.MASMOVIL_PRO_CLIENT_ID, 
        masmovil_pro_client_secret: process.env.MASMOVIL_PRO_CLIENT_SECRET,
        yoigo_local_camara_client_id: process.env.YOIGO_LOCAL_CAMARA_CLIENT_ID, 
        yoigo_local_camara_client_secret: process.env.YOIGO_LOCAL_CAMARA_CLIENT_SECRET, 
        yoigo_dev_authz_code_client_id: process.env.YOIGO_DEV_AUTHZ_CODE_CLIENT_ID, 
        yoigo_dev_authz_code_client_secret: process.env.YOIGO_DEV_AUTHZ_CODE_CLIENT_SECRET, 

        agents_prepaid_sta_client_id: process.env.AGENTS_PREPAID_STA_CLIENT_ID,
        agents_prepaid_sta_client_secret: process.env.AGENTS_PREPAID_STA_CLIENT_SECRET,
        agents_prepaid_pro_client_id: process.env.AGENTS_PREPAID_PRO_CLIENT_ID,
        agents_prepaid_pro_client_secret: process.env.AGENTS_PREPAID_PRO_CLIENT_SECRET,

        yoigo_sta_camara_client_id: process.env.YOIGO_STA_CAMARA_CLIENT_ID, 
        yoigo_sta_camara_client_secret: process.env.YOIGO_STA_CAMARA_CLIENT_SECRET, 
        yoigo_sta_authz_code_client_id: process.env.YOIGO_STA_AUTHZ_CODE_CLIENT_ID, 
        yoigo_sta_authz_code_client_secret: process.env.YOIGO_STA_AUTHZ_CODE_CLIENT_SECRET, 
        yoigo_sta_device_code_client_id: process.env.YOIGO_STA_DEVICE_CODE_CLIENT_ID, 
        yoigo_sta_device_code_client_secret: process.env.YOIGO_STA_DEVICE_CODE_CLIENT_SECRET, 
        yoigo_pro_device_code_client_id: process.env.YOIGO_PRO_DEVICE_CODE_CLIENT_ID, 
        yoigo_pro_device_code_client_secret: process.env.YOIGO_PRO_DEVICE_CODE_CLIENT_SECRET, 
        yoigo_pro_client_secret: process.env.YOIGO_PRO_CLIENT_SECRET,
        yoigo_pro_client_id: process.env.YOIGO_PRO_CLIENT_ID, 
        yoigo_pro_client_secret: process.env.YOIGO_PRO_CLIENT_SECRET,
        masmovil_local_client_id: process.env.MASMOVIL_LOCAL_CLIENT_ID, 
        masmovil_local_client_secret: process.env.MASMOVIL_LOCAL_CLIENT_SECRET,
        euskaltel_local_client_id: process.env.EUSKALTEL_LOCAL_CLIENT_ID, 
        euskaltel_local_client_secret: process.env.EUSKALTEL_LOCAL_CLIENT_SECRET,
        euskaltel_dev_client_id: process.env.EUSKALTEL_DEV_CLIENT_ID, 
        euskaltel_dev_client_secret: process.env.EUSKALTEL_DEV_CLIENT_SECRET,
        euskaltel_sta_client_id: process.env.EUSKALTEL_STA_CLIENT_ID, 
        euskaltel_sta_client_secret: process.env.EUSKALTEL_STA_CLIENT_SECRET,
        jazztel_local_client_id: process.env.JAZZTEL_LOCAL_CLIENT_ID, 
        jazztel_local_client_secret: process.env.JAZZTEL_LOCAL_CLIENT_SECRET,
        jazztel_sta_fake_client_id: process.env.JAZZTEL_STA_FAKE_CLIENT_ID, 
        jazztel_sta_fake_client_secret: process.env.JAZZTEL_STA_FAKE_CLIENT_SECRET,
        jazztel_sta_client_id: process.env.JAZZTEL_STA_CLIENT_ID, 
        jazztel_sta_client_secret: process.env.JAZZTEL_STA_CLIENT_SECRET,
        google_local_client_id: process.env.GOOGLE_LOCAL_CLIENT_ID, 
        google_local_client_secret: process.env.GOOGLE_LOCAL_CLIENT_SECRET,
        google_dev_client_id: process.env.GOOGLE_DEV_CLIENT_ID, 
        google_dev_client_secret: process.env.GOOGLE_DEV_CLIENT_SECRET,
        google_sta_client_id: process.env.GOOGLE_STA_CLIENT_ID, 
        google_sta_client_secret: process.env.GOOGLE_STA_CLIENT_SECRET,
        google_pro_client_id: process.env.GOOGLE_PRO_CLIENT_ID, 
        google_pro_client_secret: process.env.GOOGLE_PRO_CLIENT_SECRET,
        ad_local_client_id: process.env.AD_LOCAL_CLIENT_ID, 
        ad_local_client_secret: process.env.AD_LOCAL_CLIENT_SECRET,
        ad_dev_client_id: process.env.AD_DEV_CLIENT_ID, 
        ad_dev_client_secret: process.env.AD_DEV_CLIENT_SECRET,
        ad_sta_client_id: process.env.AD_STA_CLIENT_ID, 
        ad_sta_client_secret: process.env.AD_STA_CLIENT_SECRET,
        ad_pro_client_id: process.env.AD_PRO_CLIENT_ID, 
        ad_pro_client_secret: process.env.AD_PRO_CLIENT_SECRET,
        authn_host_local: process.env.AUTHN_HOST_LOCAL, 
        authn_host_local_yoigo: process.env.AUTHN_HOST_LOCAL_YOIGO, 
        authn_host_local_masmovil: process.env.AUTHN_HOST_LOCAL_MASMOVIL, 
        authn_host_dev: process.env.AUTHN_HOST_DEV, 
        authn_host_sta: process.env.AUTHN_HOST_STA, 
        authn_host_pro: process.env.AUTHN_HOST_PRO,
        authn_host_pro_yoigo: process.env.AUTHN_HOST_PRO_YOIGO,
        authn_host_pro_masmovil: process.env.AUTHN_HOST_PRO_MASMOVIL,
    });
});

app.get('/authorize', (req, res) => {
    client_id = req.query.client_id;
    client_secret = req.query.client_secret;
    host = req.query.host;
    res.render('index');
});

app.get('/authorize-hybrid', (req, res) => {
    client_id = req.query.client_id;
    client_secret = req.query.client_secret;
    host = req.query.host;
    res.render('index-hybrid');
});

app.get('/token-page', (req, res) => {
    const token = req.query.authn;
    console.log(token);
    const Logout_Endpoint = `${host}/oauth/logout`;

    _logout = `${Logout_Endpoint}?continue=${encodeURIComponent(`${process.env.LOCAL_SCHEMA}://${process.env.LOCAL_DOMAIN}:${process.env.LOCAL_PORT}`)}&client_id=${client_id}`;

    let authnResponse = JSON.parse(token);

    console.log(authnResponse)
    console.log(authnResponse.access_token)

    let refresh_token = "";
    if ('refresh_token' in authnResponse) {
        refresh_token=authnResponse.refresh_token;
    }
    res.render('access-token', { logout: _logout, 
        authn: JSON.stringify(authnResponse, undefined, 2),
        token: authnResponse.access_token,
        refresh_token: refresh_token,
        disable_link: refresh_token === "" ? "disabled-link" : "",
     });

});

app.get('/check-device', async (req, res) => {
    try {
        const Token_Endpoint = `${host}/oauth/token`;
        const deviceCode = req.query.device_code; // Obtén el device_code de la solicitud

        // const clientID = process.env.CLIENT_ID;

        // Realiza una solicitud al servidor de OAuth para verificar el device_code
        const response = await fetch(Token_Endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-User-Agent-Alias': `${process.env.USER_AGENT_ALIAS}`,
            },
            body: new URLSearchParams({
                'grant_type': 'urn:ietf:params:oauth:grant-type:device_code',
                'device_code': deviceCode,
                "client_id": client_id
            })
        });

        // Verifica si la respuesta del servidor de OAuth es exitosa
        const data = await response.json();
        if (response.ok) {


            // Si se obtiene un token del servidor de OAuth, devuelve el token como respuesta
            if (data.access_token) {
                res.json({ authn: data });
            } else {
                console.log(data);
                // Si no se obtiene un token, devuelve un error
                res.status(400).json({ error: 'No se pudo obtener un token' });
            }
        } else {
            console.log(data);
            console.log(response.status);
            // Si la respuesta del servidor de OAuth no es exitosa, devuelve un error
            res.status(response.status).json({ error: 'Error al verificar el dispositivo' });
        }
    } catch (error) {
        console.error('Error al verificar el dispositivo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/device-code', (req, res) => {
    client_id = req.query.client_id;
    client_secret = req.query.client_secret;
    host = req.query.host;

    const Device_Endpoint = `${host}/device-authorize`;

    let body = `client_id=${client_id}`;

    log.info(`Body: ${body}`);

    fetch(Device_Endpoint, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(async response => {
        
        let json = await response.json();
        console.log(json);
        res.render('device-code', { jsonData: json }); //you shouldn't share the access token with the client-side

    }).catch(error => {
        log.error(error.message);
    });
});

app.get('/ciba', (req, res) => {
    client_id = req.query.client_id;
    client_secret = req.query.client_secret;
    host = req.query.host;

    res.render('ciba');

});

app.post('/ciba', (req, res) => {
    username = req.body.username;
    bindingMessage = req.body.binding_message;
    locale = req.body.locale;

    const Ciba_Endpoint = `${host}/bc-authorize`;
    const credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

    let body = `login_hint=${username}&binding_message=${bindingMessage}&scope=${process.env.SCOPE}&acr_values=locale:${locale}`;
    if (process.env.SCOPE === undefined) {
        body = `login_hint=${username}&binding_message=${bindingMessage}&acr_values=locale:${locale}`;
    }

    log.info(`host: ${host}`);
    log.info(`client_id: ${client_id}`);
    log.info(`client_secret: ${client_secret}`);
    log.info(`credentials: ${credentials}`);
    log.info(`Body: ${body}`);

    fetch(Ciba_Endpoint, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
        }
    }).then(async response => {
        
        let json = await response.json();
        console.log(json);
        res.render('ciba-waiting', { jsonData: json }); //you shouldn't share the access token with the client-side

    }).catch(error => {
        log.error(error.message);
    });
});

app.get('/check-ciba', async (req, res) => {
    try {
        const Token_Endpoint = `${host}/oauth/token`;
        const authReqId = req.query.auth_req_id; // Obtén el device_code de la solicitud
        const credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

        // Realiza una solicitud al servidor de OAuth para verificar el device_code
        const response = await fetch(Token_Endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            },
            body: new URLSearchParams({
                'grant_type': 'urn:openid:params:grant-type:ciba',
                'auth_req_id': authReqId
            })
        });

        // Verifica si la respuesta del servidor de OAuth es exitosa
        const data = await response.json();
        if (response.ok) {


            // Si se obtiene un token del servidor de OAuth, devuelve el token como respuesta
            if (data.access_token) {
                res.json({ authn: data });
            } else {
                console.log(data);
                // Si no se obtiene un token, devuelve un error
                res.status(400).json({ error: 'No se pudo obtener un token' });
            }
        } else {
            console.log(data);
            console.log(response.status);
            // Si la respuesta del servidor de OAuth no es exitosa, devuelve un error
            res.status(response.status).json({ error: 'Error al verificar el dispositivo' });
        }
    } catch (error) {
        console.error('Error al verificar el dispositivo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//Set 1: Ask the authorization code (Standard flow)
app.get('/get/the/code', async (req, res) => {


    const Authorization_Endpoint = `${host}/oauth/authorize`;
    const Response_Type = 'code';
    const Redirect_Uri_Default = `${process.env.LOCAL_SCHEMA}://${process.env.LOCAL_DOMAIN}:${process.env.LOCAL_PORT}/give/me/the/code`;
    const Scope = process.env.SCOPE;
    const State = `${uuid.v1()}`;
    const Nonce = Math.random().toString(36).substring(2);

    log.info("redirect: " + process.env.REDIRECT_OVERRIDE)

    if (process.env.REDIRECT_OVERRIDE === undefined) {
        Redirect_Uri = Redirect_Uri_Default;
    }else {
        Redirect_Uri = process.env.REDIRECT_OVERRIDE;
    }

   let url = `${Authorization_Endpoint}?response_type=${Response_Type}&client_id=${client_id}&redirect_uri=${Redirect_Uri}&state=${State}&groups_hint=${process.env.GROUPS_HINT}&login_hint=${process.env.LOGIN_HINT}&access_type=${process.env.ACCESS_TYPE}&nonce=${Nonce}&scope=${Scope}`;
    if (process.env.SCOPE === undefined) {
        url = `${Authorization_Endpoint}?response_type=${Response_Type}&client_id=${client_id}&redirect_uri=${Redirect_Uri}&state=${State}&groups_hint=${process.env.GROUPS_HINT}&login_hint=${process.env.LOGIN_HINT}&access_type=${process.env.ACCESS_TYPE}`;
    }
  
    log.info(url);
    log.info("*****************************");
    log.info(Scope);
    log.info("*****************************");

    if (Scope && Scope.includes("dpv:")) {
        console.info("el scope tiene un proposito")
        const headers = {
            'x-network-verified-msisdn': `${process.env.CAMARA_MSISDN}`,
        };

        try {
            const respuesta = await axios.get(url, { headers });

            res.status(respuesta.status).send(respuesta.data);
        } catch (error) {
            console.error('Error en la solicitud de redirección:', error.message);
            res.status(500).send('Error en la redirección');
        }
    } else {
        console.info("el scope NO tiene un proposito")

        res.redirect(url);
    }
});

//Hybrid Flow: Ask the authorization code with id_token and token
app.get('/get/the/code/hybrid', async (req, res) => {

    const Authorization_Endpoint = `${host}/oauth/authorize`;
    const Response_Type = 'code id_token token';
    const Redirect_Uri_Default = `https://${process.env.LOCAL_DOMAIN}:${HTTPS_PORT}/give/me/the/code`;
    const Scope = process.env.SCOPE;
    const State = `${uuid.v1()}`;

    log.info("redirect: " + process.env.REDIRECT_OVERRIDE)

    if (process.env.REDIRECT_OVERRIDE === undefined) {
        Redirect_Uri = Redirect_Uri_Default;
    }else {
        Redirect_Uri = process.env.REDIRECT_OVERRIDE;
    }

    let url = `${Authorization_Endpoint}?response_type=${Response_Type}&client_id=${client_id}&redirect_uri=${Redirect_Uri}&state=${State}&groups_hint=${process.env.GROUPS_HINT}&login_hint=${process.env.LOGIN_HINT}&access_type=${process.env.ACCESS_TYPE}&scope=openid&nonce=n-0S6_WzA2Mj`;

    log.info(url);
    log.info("*****************************");
    log.info(Scope);
    log.info("*****************************");



        res.redirect(url);

});

//Step 2: Get the code from the URL
app.get('/give/me/the/code', (req, res) => {
    const Logout_Endpoint = `${host}/oauth/logout`;

    _logout = `${Logout_Endpoint}?continue=${encodeURIComponent(`${process.env.LOCAL_SCHEMA}://${process.env.LOCAL_DOMAIN}:${process.env.LOCAL_PORT}`)}&client_id=${client_id}`;
    //before continue, you should check that req.query.state is the same that the state you sent
    res.render('exchange-code', { code: req.query.code, state: req.query.state, logout: _logout});
});

//Step 3: Exchange the code for a token
app.post('/exchange/the/code/for/a/token', (req, res) => {

    const Token_Endpoint = `${host}/oauth/token`;
    const Grant_Type = 'authorization_code';
    const Code = req.body.code;
    const Redirect_Uri_Default = `${process.env.LOCAL_SCHEMA}://${process.env.LOCAL_DOMAIN}:${process.env.LOCAL_PORT}/give/me/the/code`;
    const Scope = process.env.SCOPE;

    if (process.env.REDIRECT_OVERRIDE === undefined) {
        Redirect_Uri = Redirect_Uri_Default;
    }else {
        Redirect_Uri = process.env.REDIRECT_OVERRIDE;
    }

    let body = `grant_type=${Grant_Type}&code=${Code}&redirect_uri=${encodeURIComponent(Redirect_Uri)}&client_id=${client_id}&client_secret=${client_secret}`;

    log.info(`Body: ${body}`);

    fetch(Token_Endpoint, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-User-Agent-Alias': `${process.env.USER_AGENT_ALIAS}`,
        }
    }).then(async response => {

        const Logout_Endpoint = `${host}/oauth/logout`;
    
        _logout = `${Logout_Endpoint}?continue=${encodeURIComponent(`${process.env.LOCAL_SCHEMA}://${process.env.LOCAL_DOMAIN}:${process.env.LOCAL_PORT}`)}&client_id=${client_id}`;

        let authnResponse = await response.json();

        console.log(authnResponse)
        console.log(authnResponse.access_token)

        let refresh_token = "";
        if ('refresh_token' in authnResponse) {
            refresh_token=authnResponse.refresh_token;
        }
        res.render('access-token', { logout: _logout, 
            authn: JSON.stringify(authnResponse, undefined, 2),
            token: authnResponse.access_token,
            refresh_token: refresh_token,
            disable_link: refresh_token === "" ? "disabled-link" : "",
         });
    
    }).catch(error => {
        log.error(error.message);
    });
});

app.get('/refresh_token', (req, res) => {

    refresh_token = req.query.refresh_token;

    const Token_Endpoint = `${host}/oauth/token`;
    const Grant_Type = 'refresh_token';

    const credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    let body = `grant_type=${Grant_Type}&refresh_token=${refresh_token}&scope=openid`;

    log.info(`Body: ${body}`);

    fetch(Token_Endpoint, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-User-Agent-Alias': `${process.env.USER_AGENT_ALIAS}`,
            'Authorization': `Basic ${credentials}`
        }
    }).then(async response => {

        const Logout_Endpoint = `${host}/oauth/logout`;
    
        _logout = `${Logout_Endpoint}?continue=${encodeURIComponent(`${process.env.LOCAL_SCHEMA}://${process.env.LOCAL_DOMAIN}:${process.env.LOCAL_PORT}`)}&client_id=${client_id}`;

        let authnResponse = await response.json();

        console.log(authnResponse)
        console.log(authnResponse.access_token)

        let refresh_token = "";
        if ('refresh_token' in authnResponse) {
            refresh_token=authnResponse.refresh_token;
        }
        res.render('access-token', { logout: _logout, 
            authn: JSON.stringify(authnResponse, undefined, 2),
            token: authnResponse.access_token,
            refresh_token: refresh_token,
            disable_link: refresh_token === "" ? "disabled-link" : "",
         });
    
    }).catch(error => {
        log.error(error.message);
    });
});

//Step 4: Call the protected API
// app.post('/call/mas-stack', (req, res) => {

//     let access_token = JSON.parse(req.body.token).access_token;

//     const Mas_stack_Endpoint = `${process.env.API_MAS_STACK}`;

//     //Call Mas-stack with your access token
//     fetch(`${Mas_stack_Endpoint}`, {
//         headers: {
//             'Authorization': `Bearer ${access_token}`
//         }
//     }).then(async response => {

//         let json = await response.json();
//         res.render('calling-ms-graph', { response: JSON.stringify(json, undefined, 2) });
//     });
// });

app.post('/call/mas-stack', async (req, res) => {
    let access_token = JSON.parse(req.body.token).access_token;
    const Mas_stack_Endpoint = `${process.env.API_MAS_STACK}`;

    try {
        let response;
        if (Mas_stack_Endpoint.includes('totp')) {
            // Make a POST request if the endpoint includes 'totp'
            response = await axios.post(Mas_stack_Endpoint, {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'x-auth-sub': `gasai@yahoo.es`,
                    'x-auth-tenants': `v1::fffff`,
                    'x-auth-roles': `itself`,
                },
                responseType: 'arraybuffer' // to handle binary data
            });
            // Convert image data to base64
            let img = Buffer.from(response.data, 'binary').toString('base64');
            // Render the image in the view
            res.render('calling-ms-graph', { image: img });
        } else {
            // Make a GET request if the endpoint does not include 'totp'
            response = await axios.get(Mas_stack_Endpoint, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            res.render('calling-ms-graph', { response: JSON.stringify(response.data, undefined, 2) });
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Configuración para HTTPS
const httpsOptions = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
};

const PORT = process.env.PORT || 8000;
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;

// Crear y levantar el servidor HTTPS
https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    log.info(`Servidor HTTPS corriendo en el puerto ${HTTPS_PORT}`);
});