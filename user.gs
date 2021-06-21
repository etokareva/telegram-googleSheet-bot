function handleData(data) {
    const {message, callback_query} = data;

    if (callback_query) {
        handleCallbackQuery(callback_query);
    } else if (message) {
        handleMessage(message);
    }
}

function handleMessage(message) {
    const {from: {id}, chat: {first_name, last_name, username}, text, contact, message_id, reply_to_message} = message;
    const name = first_name + " " + last_name;
    let user = getUser(id);
    let isApproved = isUserApproved(user);
    let keyboardAuthorized = keyboardBottom(user);

    if (contact && !user) {
        registerUser(id, contact.phone_number, name, username);
        sendForceReplyResponse(id, 'Задайте имя для отображения в таблице:', keyboardAuthorized);
        user = getUser(id);
        isApproved = isUserApproved(user);
        keyboardAuthorized = keyboardBottom(user);
    }

    switch (text) {

        case "/start" :
        case "/menu" :
        case "Меню" : {
            let msg = 'Здравствуйте';
            if (!user) {
                msg += ', нажмите кнопку "Регистрация"'
                sendResponse(id, msg, keyboardAuthorized);
            }
            if (user && user[nickNameIndex]) {
                msg += ', '+ user[nickNameIndex];
                sendResponse(id, msg, keyboardAuthorized);
            }
            break;
        }
        case "/book":
        case "Бронировать": {
            if (isApproved) {
                sendResponse(id, 'Выбрать дату:', keyboardDates());
            } else if (user && !isApproved) {
                sendResponse(id, 'Вы уже зарегистрированы, теперь нужно дождаться одобрения администратора', keyboardAuthorized);
            }
            else {
                sendResponse(id, 'Для того, чтобы забронировать сеты, Вы сначала должны зарегистрироваться и Вашу учетную запись должен одобрить администратор', keyboardAuthorized);
            }

            break;
        }
        case "/bookings":
        case "Бронирования": {
            const sets = keyboardMySets(user[nickNameIndex]);
            if (sets.inline_keyboard.length === 0) {
                sendResponse(id, 'У Вас нет забронированных сетов');
            } else {
                sendResponse(id, 'Ваши сеты: ', sets);
            }
            break;
        }
        case "/register":
        case "Регистрация": {
            const msg = user && isApproved ? 'Вы уже зарегистрированы и можете бронировать сеты': 'Ваша заявка отправлена на согласование. Как только её одобрят, Вы получите сообщение';
            sendResponse(id, msg);
            break;
        }
        case "/contacts":
        case "Контакты": {
            locationResponse(id);
            break;
        }
        default: {
            if (user && !user[nickNameIndex] && !contact) {
                setNickName(id, text);
                afterRegister(id);
            }
            break;
        }
    }
}

function handleCallbackQuery(callback_query) {

    const {from: {id, first_name, last_name, username}, data, message} = callback_query;
    const name = first_name + " " + last_name;
    const user = getUser(id);
    const isApproved = isUserApproved(user);
    const keyboardAuthorized = keyboardBottom(user);
    const dataObject = JSON.parse(data);
    const {date, key, time, id: newUserId} = dataObject;
    const message_id = message ? message.message_id : undefined;

    switch (key) {
        case "date": {
            const availableSetsKeyboard = keyboardAvailableSets(date);
            if (availableSetsKeyboard.inline_keyboard.length === 0) {
                deleteMessage(id, message_id);
                sendResponse(id, 'Нет доступных сетов на ' + date, keyboardBottom(user));
            } else {
                editResponse(id, message_id, 'Доступные для бронирования сеты на ' + date, availableSetsKeyboard);
            }
            break;
        }
        case "time": {
            const confirmKeyboard = keyBoardConfirm(dataObject);

            const setsCount = getMySetsForDate(date, user[nickNameIndex]).length;
            if (setsCount < 3) {
                editResponse(id, message_id, 'Вы выбрали ' + date + ', ' + time + '. Верно?', confirmKeyboard);
            } else {
                editResponse(id, message_id, 'Для того, чтобы забронировать более трёх сетов в день, Вам нужно позвонить нам.');
                const sets = keyboardMySets(user[nickNameIndex]);

                if (sets.inline_keyboard.length === 0) {
                    sendResponse(id, 'У Вас нет забронированных сетов');
                } else {
                    sendResponse(id, 'Ваши сеты: ', sets);
                }
            }
            break;
        }
        case "cancel": {
            deleteMessage(id, message_id);
            break;
        }
        case "cancelUser": {
            if (newUserId) {
                const newUser = getUser(newUserId);
                deleteMessage(adminId, message_id);
                sendResponse(adminId, 'Вы отклонили учетную запись для <b>' + newUser.join(' ') + '</b>', keyboardDelete);
                sendResponse(newUserId, 'Вашу учетную запись не согласовали, свяжитесь с нами. ', keyboardBottom(newUser) );
            }
            break;
        }
        case "confirm": {
            deleteMessage(id, message_id);
            const nickName = user[nickNameIndex];
            writeSetForDateTime(id, date, time, nickName);
            const sets = keyboardMySets(user[nickNameIndex]);

            const match = sets.inline_keyboard.some(it => {
                const parsed = JSON.parse(it[0].callback_data);
                return (time === parsed.time) && (date === parsed.date);
            });

            if (match) {
                sendResponse(id, 'Вы забронировали сет на <b>'+date + ' '+ time+'</b>', keyboardAuthorized);
                sendResponse(id, 'Ваши сеты: ', sets);
            } else {
                sendResponse(id, 'Сет не удалось забронировать', keyboardAuthorized);
            }
            break;
        }
        case "confirmCancelling": {
            const diff = getDiffHr(date, time);

            deleteMessage(id, message_id);
            if (diff < 2) {
                sendResponse(id, 'Вы можете отменить сет не позднее, чем за два часа до его начала', keyboardAuthorized );
            } else {
                const result = writeSetForDateTime(id, date, time);
                sendResponse(id, result ? 'Ваш сет ' + date + ' ' + time + ' отменен': 'Ваш сет не был отменен', keyboardAuthorized );
            }
            break;
        }
        case "confirmUser": {
            if (newUserId) {
                approveUser(newUserId);
                deleteMessage(adminId, message_id);
                const newUser = getUser(newUserId);
                sendResponse(adminId, 'Вы подтвердили учетную запись для <b>' + newUser.join(' ') + '</b>', keyboardDelete);
                sendResponse(newUserId, 'Вашу учетную запись согласовали, теперь можно бронировать сеты. ', keyboardBottom(newUser) );
            }
            break;
        }
        case "myBookings": {
            const confirmKeyboard = keyBoardConfirm(dataObject, 'Cancelling');
            editResponse(id, message_id, 'Вы хотите отменить сет ' + date + ', ' + time + '. Верно?', confirmKeyboard);
            break;
        }
    }
}

function registerUser(id, phone_number, name, userName) {
    const checkbox = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    const users = SpreadsheetApp.openById(ssUsersTableId);
    const sheet = users.getSheets()[0];
    const lastRow = sheet.getLastRow() || 0;
    const rowIndex = lastRow + 1;
    sheet.insertRows(rowIndex, 1);
    sheet.getRange(rowIndex, 1).setValue(id);
    sheet.getRange(rowIndex, 2).setValue(phone_number);
    sheet.getRange(rowIndex, 3).setValue(name);
    sheet.getRange(rowIndex, 4).setValue(userName);
    sheet.getRange(rowIndex, 5).setValue(new Date());
    sheet.getRange(rowIndex, 6).setDataValidation(checkbox).setValue("FALSE");
}

function afterRegister(id) {
    const user = getUser(id);
    const text = 'Новая регистрация: <b>'+ user.join(' ')+ '</b>. Подтвердите учетную запись, если хотите дать пользователю права на бронирование сетов';

    sendResponse(adminId, text, keyBoardApprove(id));
    sendResponse(id, 'Ваша заявка была передана администратору, Вам придет сообщение, когда она будет одобрена', keyboardBottom(user));
}
