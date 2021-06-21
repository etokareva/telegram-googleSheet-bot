const token = "telegram bot API token";
const telegramUrl = "https://api.telegram.org/bot" + token;
const webAppUrl = "Google Script App token";
const ssId = "Spreadsheet logger table id";
const ssTimeTableId = "Spreadsheet timetable id";
const ssUsersTableId = "Spreadsheet Users table id";
const adminId = "admin telegram id";


const textAddress = 'Address';
const textNumber = 'Phone number';
const days = ['Вс','Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const approveIndex = 5;
const nickNameIndex = 6;
const usernameIndex = 3;
const nameIndex = 2;
const daysAheadCount = 2;

let currentYear;
{
    const currentDate = new Date();
    currentYear = currentDate.getFullYear();
}