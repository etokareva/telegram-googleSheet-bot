function formatDate(date) {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    const dayNumber = date.getDay();
    const day = days[dayNumber];

    return `${day} ${dd}.${mm}`;
}

function formatTime(date) {

    let hr = date.getHours();
    if (hr < 10) hr = '0' + hr;

    let min = date.getMinutes();
    if (min < 10) min = '0' + min;

    return [hr, min].join(':');
}


function getDateFromStrings(sheetName, time) {
    const [dayOfWeek, date] = sheetName.split(' ');
    const [day, month] = date.split('.');
    const [hr, min] = time.split(':');

    return new Date(currentYear, Number(month)-1, day, hr, min);
}

function getDiffHr(formattedDate, time) {
    const now = new Date();
    const bookingDate = getDateFromStrings(formattedDate, time);
    const diff = bookingDate.getTime() - now.getTime();

    return Math.floor(diff/(1000 * 3600));
}

function getDay(formattedDate) {
    const date = getDateFromStrings(formattedDate, '00:00');
    const dayNumber = date.getDay();

    return days[dayNumber];
}

function isFutureTime(formattedDate, time) {
    const now = new Date();
    const date = getDateFromStrings(formattedDate, time);
    const diff = date.getTime() - now.getTime();

    return diff >= 0;
}

function isToday(someDate) {
    const today = new Date();
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}
