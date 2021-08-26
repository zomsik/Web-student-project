/*jshint esversion: 6 */

async function responseLogReg(url){
    const response = await fetch(`${url}`, {});
    return response.text();
} 

async function Zaloguj() {
    $("#ModalTytul").html("Logowanie");
    $("#ModalAkceptuj").html("Zaloguj");

    const fetchLogowania = await responseLogReg("https://zomsik.github.io/Web-student-project/dane/formLogowania.txt");
    
    $("#ModalTresc").html(fetchLogowania);
}

async function Zarejestruj() {
    $("#ModalTytul").html("Rejestracja");
    $("#ModalAkceptuj").html("Zarejestruj");

    const fetchRejestracji = await responseLogReg("https://zomsik.github.io/Web-student-project/dane/formRejestracji.txt");
    
    $("#ModalTresc").html(fetchRejestracji);
}


function SprawdzLogowanie() {
    let login = $('#LoginNick').val();
    let haslo = $('#Haslo').val();


    if (login == "" || haslo == "") {
        $('#login_error').html("Uzupełnij wszystkie pola!");
        return;
    } else $('#login_error').html("");

    if (!localStorage.getItem(login)) {
        $('#login_error').html("Taki użytkownik nie istnieje!");
        return;
    } else $('#login_error').html("");


    var retrieveItem = JSON.parse(localStorage.getItem(login));

    if (retrieveItem.haslo != haslo) {
        $('#login_error').html("Błędne hasło!");
        return;
    } else $('#login_error').html("");

    window.createNotification({
        closeOnClick: true,
        displayCloseButton: true,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Logowanie',
        message: 'Zalogowano pomyślnie!'
    });
    sessionStorage.clear();

    let obiekt = {
        'login': retrieveItem.login,
        'email': retrieveItem.email,
        'haslo': retrieveItem.haslo
    };
    sessionStorage.setItem(login, JSON.stringify(obiekt));

    $('#Modal').modal('hide');
    window.location.href = "menu.html";


}


function sprawdzPole(pole_id, obiektRegex) {
    var obiektPole = document.getElementById(pole_id);
    if (!obiektRegex.test(obiektPole.value)) return (false);
    else return (true);
}



function SprawdzRejestrowanie() {
    var ok = true;
    let login = $('#LoginNick').val();
    let email = $('#Email').val();
    let haslo = $('#Haslo').val();

    var LoginPattern = /^[a-zA-Z0-9]{4,20}$/;
    var EmailPattern = /^([a-zA-Z0-9])+([.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]+)+/;
    var PasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{4,20}$/;

    $('#register_error').html("");

    //Patterny
    if (!sprawdzPole("LoginNick", LoginPattern)) {
        ok = false;
        $('#login_error').html("Login powinien mieć conajmniej 4 znaki!");
    } else $('#login_error').html("");

    if (!sprawdzPole("Email", EmailPattern)) {
        ok = false;
        $('#email_error').html("Podano błędnie adres email!");
    } else $('#email_error').html("");

    if (!sprawdzPole("Haslo", PasswordPattern)) {
        ok = false;
        $('#password_error').html("Hasło musi mieć minimum jeden znak, dużą i małą literę i od 4 do 20 znaków!");
    } else $('#password_error').html("");

    //Sprawdź czy nie zajęte
    if (ok) {
        if (localStorage.getItem(login)) {
            $('#register_error').html("Taki użytkownik już istnieje!");
            return;
        } else $('#register_error').html("");

        for (var i = 0; i < localStorage.length; i++) {
            var retrieveItem = JSON.parse(localStorage.getItem(localStorage.key(i)));
            if (retrieveItem.email == email) {
                $('#register_error').html("Ten email jest już zajęty!");
                return;
            } else $('#register_error').html("");
        }


        let obiekt = {
            'login': login,
            'email': email,
            'haslo': haslo
        };
        localStorage.setItem(login, JSON.stringify(obiekt));
        $('#Modal').modal('hide');


        window.createNotification({
            closeOnClick: true,
            displayCloseButton: false,
            positionClass: 'nfc-top-right',
            onclick: false,
            showDuration: 3000,
            theme: 'success'
        })({
            title: 'Rejestracja zakończona',
            message: 'Pomyślnie zarejestrowano!'
        });
    }

}

$('#ModalAkceptuj').click(function() {
    let akcja = $('#ModalAkceptuj').text();
    if (akcja == "Zaloguj") SprawdzLogowanie();
    else if (akcja == "Zarejestruj") SprawdzRejestrowanie();
});