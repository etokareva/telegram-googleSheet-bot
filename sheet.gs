function logUserActions(row) {
    SpreadsheetApp.openById(ssId).getSheets()[0].appendRow(row);
}

function getLastRow() {
    const timeTableSheet = SpreadsheetApp.openById(ssTimeTableId);
    const lastRow = timeTableSheet.getDataRange().getLastRow();

    return lastRow;
}

function getAllSetsForDate(formattedDate) {
    const timeTableSheet = SpreadsheetApp.openById(ssTimeTableId).getSheetByName(formattedDate);
    if (!timeTableSheet) {
        return [];
    }
    // <-- clear cache hack:
    timeTableSheet.getRange(1, 20).clearContent();
    // -->
    const rows = timeTableSheet.getDataRange().getValues();
    const sets = [];

    for (var i = 1; i < rows.length; i++) {
        const ISODate = rows[i][0];
        const time = new Date(ISODate);
        sets.push([formatTime(time), rows[i][1]]);
    }
    return sets;
}

function getAvailableSetsForDate(formattedDate) {
    return getAllSetsForDate(formattedDate).filter(row => row[1] === "");
}

function getMySetsForDate(formattedDate, nickName) {
    return getAllSetsForDate(formattedDate).filter(row => row[1] === nickName);
}

function writeSetForDateTime(id, formattedDate, formattedTime, name = '') {
    const timeTableSheet = SpreadsheetApp.openById(ssTimeTableId).getSheetByName(formattedDate);
    const rows = timeTableSheet.getDataRange().getValues();
    let result = false;

    for (var i = 1; i < rows.length; i++) {
        const ISODate = rows[i][0];
        const time = new Date(ISODate);
        if (formatTime(time) === formattedTime) {
            // <-- clear cache hack:
            timeTableSheet.getRange(i+1, 20).clearContent();
            // -->
            const cell = timeTableSheet.getRange(i + 1, 2);
            if (name && cell.getValue() === '' || !name && cell.getValue() !== '') {
                result = true;
            }
            cell.setValue(name);
        }
    }

    return result;
}

function approveUser(id) {
    const sheet = SpreadsheetApp.openById(ssUsersTableId).getSheets()[0];
    const rows = sheet.getDataRange().getValues();
    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex > -1) {
        sheet.getRange(rowIndex + 1, approveIndex + 1).setValue("TRUE");
    }
}

function setNickName(id, nickName) {
    const sheet = SpreadsheetApp.openById(ssUsersTableId).getSheets()[0];
    const rows = sheet.getDataRange().getValues();
    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex > -1) {
        sheet.getRange(rowIndex + 1, nickNameIndex + 1).setValue(nickName);
    }
}

function getUser(id) {
    const sheet = SpreadsheetApp.openById(ssUsersTableId).getSheets()[0];
    const rows = sheet.getDataRange().getValues();
    const user = rows.find(row => row[0] === id);

    return user;
}

function getUserByUserName(username) {
    const sheet = SpreadsheetApp.openById(ssUsersTableId).getSheets()[0];
    const rows = sheet.getDataRange().getValues();
    const user = rows.find(row => row[3] === username);

    return user;
}

function getUserByNickName(nickName) {
    const sheet = SpreadsheetApp.openById(ssUsersTableId).getSheets()[0];
    const rows = sheet.getDataRange().getValues();
    const user = rows.find(row => row[nickNameIndex] === nickName);

    return user;
}

function isUserApproved(user) {
    return user && user[approveIndex];
}


