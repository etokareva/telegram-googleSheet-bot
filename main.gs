function main() {
    deleteTriggers();
    createTimeTableTrigger();
    createNotifyTrigger(13, 45);
    createNotifyTrigger(18, 45);
    setWebhook();
}
