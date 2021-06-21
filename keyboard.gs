const keyboardDelete = {remove_keyboard: true};

function keyboardBottom(user) {
    const authorized = [{ text: "Бронировать" },{ text: "Бронирования" }, { text: "Контакты"}];
    const keyboard = isUserApproved(user) ? [authorized] : [[{text: "Регистрация", request_contact: true}, { text: "Контакты"}]];

    return { keyboard }
}


function keyBoardConfirm(data, appendix = '') {
    const {date, time} = data;
    const inline_keyboard = [
        [{
            text: "Да",
            callback_data: JSON.stringify({key: "confirm"+appendix, date, time})
        },
            {
                text: "Нет",
                callback_data: JSON.stringify({key: "cancel", date, time})
            }]
    ];

    return {inline_keyboard, one_time_keyboard: true}
}


function keyBoardApprove(id) {
    const user = getUser(id);
    const inline_keyboard = [
        [{
            text: "Да",
            callback_data: JSON.stringify({key: "confirmUser", id})
        },
            {
                text: "Нет",
                callback_data: JSON.stringify({key: "cancelUser", id})
            }]
    ];

    return {inline_keyboard, one_time_keyboard: true}
}



function keyboardAllSets(date) {

    const inline_keyboard = getAllSetsForDate(date).map(row => [{
        text: row[0],
        callback_data: JSON.stringify({key: 'time', date, time: row[0]})
    }]);

    return {inline_keyboard};

}

function keyboardAvailableSets(date) {

    const availableSets = getAvailableSetsForDate(date);
    const inline_keyboard = [];
    if (availableSets && availableSets.length > 0) {
        availableSets.forEach(row =>  {
            const time = row[0];
            if (isFutureTime(date, time)) {
                const callback_data = JSON.stringify({key: 'time', date, time});
                inline_keyboard.push([{text: time, callback_data}]);
            }
        })
    }

    return {inline_keyboard};

}


function keyboardDates() {
    const sheets = SpreadsheetApp.openById(ssTimeTableId).getSheets();
    const inline_keyboard = sheets.reduce((prev, sheet) => {
        const dateStr = sheet.getName();
        // <-- clear cache hack:
        sheet.getRange(1, 20).clearContent();
        // -->
        if (dateStr === 'templateSheet') {
            return prev;
        }
        const date = getDateFromStrings(dateStr, '00:00');
        if (isFutureTime(dateStr, '00:00') || isToday(date)) {
            prev.push([{text: dateStr, callback_data: JSON.stringify({key: "date", date: dateStr})}]);
        }
        return prev;
    }, []);

    return {inline_keyboard};

}

function keyboardMySets(nickName) {
    const sheets = SpreadsheetApp.openById(ssTimeTableId).getSheets().slice(-3);
    const inline_keyboard = [];
    sheets.forEach(sheet => {
        const formattedDate = sheet.getName();
        // <-- clear cache hack:
        sheet.getRange(1, 20).clearContent();
        // -->
        const sets = getMySetsForDate(formattedDate, nickName);
        sets.forEach(row => {
            const time = row[0];
            if (isFutureTime(formattedDate, time)) {
                const text = formattedDate +' '+ time + '     x';
                const button = [{text, callback_data: JSON.stringify({key:'myBookings', time, date: formattedDate})}];
                inline_keyboard.push(button);
            }
        });
    });
    return {inline_keyboard};
}