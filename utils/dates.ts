function getWeekday() {
    const now = new Date();
    return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(now);
}


function formatDate() {
    const now = new Date();
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(now);
}
  