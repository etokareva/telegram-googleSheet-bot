function createTimeTableTrigger() {

    ScriptApp.newTrigger("startTimeTable")
        .timeBased()
        .everyDays(1)
        .atHour(8)
        .nearMinute(45)
        .create();

}

function createNotifyTrigger(hr,min) {
    ScriptApp.newTrigger("reminder")
        .timeBased()
        .everyDays(1)
        .atHour(hr)
        .nearMinute(min)
        .create();
}

function deleteTriggers() {
    const triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        ScriptApp.deleteTrigger(triggers[i]);
    }
}

function startTimeTable() {
    const timeTableSheet = SpreadsheetApp.openById(ssTimeTableId);
    const date = new Date();
    date.setDate(date.getDate() + daysAheadCount);
    const sheetName = formatDate(date);
    const templateSheet = timeTableSheet.getSheetByName('templateSheet');
    templateSheet.copyTo(timeTableSheet).setName(sheetName).showSheet();
    const sheets = timeTableSheet.getSheets();

    for (let i = 0; i < sheets.length - 3; i++) {
        if (sheets[i].getName() !== 'templateSheet') {
            timeTableSheet.deleteSheet(sheets[i]);
        }
    }
}

function reminder() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const formattedDate = formatDate(date);
    const allSetsForDate = getAllSetsForDate(formattedDate);
    const users = allSetsForDate.reduce((prev, curr) => {
        const nickName = curr[1];
        if (nickName) {
            prev[nickName] = prev[nickName] ? prev[nickName] + ', ' + curr[0]: curr[0];
        }
        return prev;
    }, {});


    Object.keys(users).forEach(nickName => {
        const user = getUserByNickName(nickName);
        if (user) {
            sendResponse(user[0], 'Напоминаем, что завтра <strong>' + formattedDate + '</strong> Вы катаетесь в <strong>'+ users[nickName] +'</strong>', keyboardBottom(user));
        }
    });
}