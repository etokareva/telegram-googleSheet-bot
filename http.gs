function setWebhook() {
    const url = telegramUrl + "/setWebhook?url=" + webAppUrl;
    const response = UrlFetchApp.fetch(url);

    Logger.log(response.getContentText());
}


function getMe() {
    const url = telegramUrl + "/getMe";
    const response = UrlFetchApp.fetch(url);

    Logger.log(response.getContentText());
}

function post(payload) {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', {method: "post", payload})
}


function sendResponse(id, text, keyboard = undefined) {

    let payload = createResponsePayload("sendMessage", id, text, keyboard);

    post(payload);
}


function sendForceReplyResponse(id, text) {

    let payload = {
        method: "sendMessage",
        chat_id: String(id),
        text,
        reply_markup: JSON.stringify({force_reply: true})
    };

    post(payload);
}

function editResponse(id, messageId, text, keyboard = undefined) {

    let payload = createResponsePayload("editMessageText", id, text, keyboard);

    post({...payload, message_id: String(messageId)});
}

function deleteMessage(id, messageId) {
    const payload = {method: "deleteMessage", chat_id: String(id), message_id: String(messageId)};
    post(payload);
}

function createResponsePayload(method, id, text = undefined, keyboard = undefined) {

    let payload = {method, chat_id: String(id)};

    if (text) {
        payload = {...payload, text};
    }

    if (keyboard) {

        payload = {
            ...payload,
            parse_mode: "HTML",
            reply_markup: JSON.stringify({...keyboard, resize_keyboard: true}),
            resize_keyboard: true
        }

    }

    return payload;

}

function locationResponse(id) {
    const latitude = 59.79315305288161;

    const longitude = 30.687943713888114;

    const payload = {
        method: "sendVenue",
        chat_id: String(id),
        latitude,
        longitude,
        title: textNumber,
        address: textAddress
    };


    post(payload);
}


function doPost(ev) {
    try {

        const data = JSON.parse(ev.postData.contents);
        handleData(data);

    } catch (err) {

        sendResponse(adminId, JSON.stringify(err, null, 4));
    }
}