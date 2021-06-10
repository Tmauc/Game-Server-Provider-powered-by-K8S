function go(id) {
    localStorage.setItem('user_id', JSON.stringify(id));
    window.location.replace("/user");
}