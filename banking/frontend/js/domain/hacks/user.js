export function currentUserId() {
    return JSON.parse(window.localStorage.getItem('user')).id;
}
