/*jshint esversion: 8 */
$(document).ready(function() {

    $('#nickUzytkownika').html("Witaj " + sessionStorage.key(0) + "!");

});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function zamknij() {
    $('#modalEmail').modal('hide');
    $('#modalPassword').modal('hide');
    $('#modalDelete').modal('hide');
}


function ZmianaMaila() {
    fetch("http://localhost/Projekt/dane/changeMail.txt")
        .then(response => {
            return response.text();
        })
        .then(dane => {
            $("#DivModal").html(dane);
        })
        .then(() => {
            $('#modalEmail').modal('show');
        });
}

function ZmianaHasla() {
    fetch("http://localhost/Projekt/dane/changePassword.txt")
        .then(response => {
            return response.text();
        })
        .then(dane => {
            $("#DivModal").html(dane);
        })
        .then(() => {
            $('#modalPassword').modal('show');
        });

}

function UsuniecieKonta() {
    fetch("http://localhost/Projekt/dane/deleteAccount.txt")
        .then(response => {
            return response.text();
        })
        .then(dane => {
            $("#DivModal").html(dane);
        }).then(() => {
            $('#modalDelete').modal('show');
        });

}

function sprawdzPole(pole_id, obiektRegex) {
    var obiektPole = document.getElementById(pole_id);
    if (!obiektRegex.test(obiektPole.value)) return (false);
    else return (true);
}


function SprawdzZmianeMaila() {
    let staryMail = $('#staryMail').val();
    let nowyMail = $('#nowyMail').val();
    var EmailPattern = /^([a-zA-Z0-9])+([.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]+)+/;

    let key = sessionStorage.key(0);
    let retrieveItem = JSON.parse(localStorage.getItem(key));

    if (staryMail == "" || nowyMail == "") {
        $('#change_error').html("Uzupełnij wszystkie pola!");
        return;
    } else $('#change_error').html("");

    if (retrieveItem.email != staryMail) {
        $('#change_error').html("To konto ma inny mail!");
        return;
    } else $('#change_error').html("");


    if (!sprawdzPole("nowyMail", EmailPattern)) {
        $('#change_error').html("Nowy email jest niepoprawny!");
        return;
    } else $('#change_error').html("");

    for (var i = 0; i < localStorage.length; i++) {
        var retrieveDane = JSON.parse(localStorage.getItem(localStorage.key(i)));

        if (localStorage.key(i) == key) continue;

        if (retrieveDane.email == nowyMail) {
            $('#change_error').html("Ten email jest już zajęty!");
            return;
        } else $('#change_error').html("");
    }


    localStorage.removeItem(key);

    let obiekt = {
        'login': retrieveItem.login,
        'email': nowyMail,
        'haslo': retrieveItem.haslo
    };
    localStorage.setItem(retrieveItem.login, JSON.stringify(obiekt));

    zamknij();

    window.createNotification({
        closeOnClick: true,
        displayCloseButton: false,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Zmiana zakończona',
        message: 'Pomyślnie zmieniono mail!'
    });


}

function SprawdzZmianeHasla() {
    let stareHaslo = $('#stareHaslo').val();
    let noweHaslo = $('#noweHaslo').val();
    var PasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{4,20}$/;

    let key = sessionStorage.key(0);
    let retrieveItem = JSON.parse(localStorage.getItem(key));

    if (stareHaslo == "" || noweHaslo == "") {
        $('#change_error').html("Uzupełnij wszystkie pola!");
        return;
    } else $('#change_error').html("");

    if (retrieveItem.haslo != stareHaslo) {
        $('#change_error').html("To konto ma inne hasło!");
        return;
    } else $('#change_error').html("");


    if (!sprawdzPole("noweHaslo", PasswordPattern)) {
        $('#change_error').html("Hasło musi mieć minimum jeden znak, dużą i małą literę i od 4 do 20 znaków!");
        return;
    } else $('#change_error').html("");


    localStorage.removeItem(key);

    let obiekt = {
        'login': retrieveItem.login,
        'email': retrieveItem.email,
        'haslo': noweHaslo
    };
    localStorage.setItem(retrieveItem.login, JSON.stringify(obiekt));

    zamknij();

    window.createNotification({
        closeOnClick: true,
        displayCloseButton: false,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Zmiana zakończona',
        message: 'Pomyślnie zmieniono hasło!'
    });
}

function UsunKonto() {
    let key = sessionStorage.key(0);
    localStorage.removeItem(key);
    sessionStorage.clear();
    window.location.href = "index.html";

}