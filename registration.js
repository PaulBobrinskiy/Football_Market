/* Плавное появление начальной страницы страницы. */
function openIndex1() { 
    document.body.style.opacity = '0';
    setTimeout(function () {
        window.location.href = 'index_first.html';
    }, 100); 
}

/* Плавное появление страницы регистрации */
function openIndex2() {
    document.getElementById('login-button').style.opacity = '0';
    setTimeout(function() {
        window.location.href = 'index_first.html';
    }, 100); 
}
