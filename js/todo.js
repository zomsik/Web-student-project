/*jshint esversion: 6 */
$(document).ready(function() {
    let key = sessionStorage.key(0) + "_todo";
    if (localStorage.hasOwnProperty(key)) {
        $('#box').html("Wybierz zadanie, aby zobaczyć jego treść");
    } else {
        $('#box').html("Dodaj zadanie, aby móc je wybrać");
    }
    wypiszZadania();

});

let openedTask = -1;

function zamknij() {
    $('#modalDelete').modal('hide');
    $('#modalEdit').modal('hide');
}

function deleteTask() {

    $('#box').css({
        'background-image': 'none',
        'min-height': '100px',
    });

    let key = sessionStorage.key(0) + "_todo";

    var obiekt = JSON.parse(localStorage.getItem(key));
    obiekt.splice(openedTask, 1);
    localStorage.setItem(key, JSON.stringify(obiekt));

    if (obiekt.length == 0) localStorage.removeItem(key);


    if (localStorage.hasOwnProperty(key)) {
        $('#box').html("Wybierz zadanie, aby zobaczyć jego treść");
    } else {
        $('#box').html("Dodaj zadanie, aby móc je wybrać");
    }
    window.createNotification({
        closeOnClick: true,
        displayCloseButton: false,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Sukces',
        message: 'Pomyślnie usunięto zadanie!'
    });

    $('#przycisk').html("");

    zamknij();
    wypiszZadania();
}

function usunZadanie(TitleToDelete, number) {

    openedTask = number;

    $('#TitleOfTask').text(TitleToDelete);
    $('#modalDelete').modal('show');
}

function checkIsCorrect(Title, Task) {

    if (Title == "") {

        window.createNotification({
            closeOnClick: true,
            displayCloseButton: true,
            positionClass: 'nfc-top-right',
            onclick: false,
            showDuration: 2000,
            theme: 'warning'
        })({
            title: 'Niepowodzenie',
            message: 'Tytuł nie może być pusty!'
        });
        return false;
    }

    if (Task == "") {

        window.createNotification({
            closeOnClick: true,
            displayCloseButton: true,
            positionClass: 'nfc-top-right',
            onclick: false,
            showDuration: 2000,
            theme: 'warning'
        })({
            title: 'Niepowodzenie',
            message: 'Treść zadania nie może być pusta!'
        });
        return false;
    }

    return true;
}

function edytujZadanie() {

    let key = sessionStorage.key(0) + "_todo";
    var obiekt = JSON.parse(localStorage.getItem(key));

    let EditTextInModal = $('#formularz').html();
    EditTextInModal = EditTextInModal.substring(0, EditTextInModal.length - 129);
    EditTextInModal = EditTextInModal.replaceAll("InputTitle", "InputTitle1");
    EditTextInModal = EditTextInModal.replaceAll("InputTask", "InputTask1");
    EditTextInModal = EditTextInModal.replaceAll("InputImage", "InputImage1");

    console.log(EditTextInModal);


    $('#modalEdit').modal('show');
    $('#EditTextInModal').html(EditTextInModal);


    $('#InputTitle1').val(obiekt[openedTask].Title);
    $('#InputTask1').val(obiekt[openedTask].Task);
    $('#InputImage1').val(obiekt[openedTask].TaskURL);
}

function confirmEdit() {

    let key = sessionStorage.key(0) + "_todo";

    let Title = $('#InputTitle1').val();
    let Task = $('#InputTask1').val();
    let TaskURL = $('#InputImage1').val();

    var obiekt = JSON.parse(localStorage.getItem(key));

    if (!checkIsCorrect(Title, Task))
        return;


    var zadanie = {};
    zadanie.Title = Title;
    zadanie.Task = Task;
    zadanie.TaskURL = TaskURL;

    obiekt[openedTask] = zadanie;
    localStorage.setItem(key, JSON.stringify(obiekt));
    wypiszZadania();
    wlaczZadanie(zadanie.Title);

    window.createNotification({
        closeOnClick: true,
        displayCloseButton: true,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Sukces',
        message: 'Pomyślnie edytowano zadanie!'
    });


    zamknij();

}

function wlaczZadanie(TitleToShow) {
    let key = sessionStorage.key(0) + "_todo";
    var obiekt = JSON.parse(localStorage.getItem(key));
    let number = 0;
    for (let i = 0; i < obiekt.length; i++) {
        if (obiekt[i].Title == TitleToShow) {
            number = i;
            break;
        }
    }
    var przycisk = `<button type="button" class="btn-close btn-close-white" onClick="usunZadanie('${obiekt[number].Title}','${number}')"   ></button>`;

    openedTask = number;
    console.log(openedTask);

    var tekst = `</br>${obiekt[number].Task}</br></br></br>`;
    if (obiekt[number].TaskURL != "") {
        $('#box').css({
            'background-image': `url(${obiekt[number].TaskURL})`,
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'min-height': '400px',
        });
    } else {
        $('#box').css({
            'background-image': 'none',
            'min-height': '100px',
        });
    }
    $('#przycisk').html(przycisk);
    $('#box').html(tekst);

    wypiszZadania();
}

function wypiszZadania() {
    let key = sessionStorage.key(0) + "_todo";
    var obiekt;
    if (localStorage.hasOwnProperty(key)) {
        obiekt = JSON.parse(localStorage.getItem(key));
    } else {
        let zakladki = "";
        $('#zakladki').html(zakladki);
        return;
    }

    if (obiekt.length == 0) {

        return;
    }
    let zakladki = `</br><div class="btn-group-vertical" role="group">`;

    if ($('#box').html() != "Wybierz zadanie, aby zobaczyć jego treść" && $('#box').html() != "Dodaj zadanie, aby móc je wybrać")
        zakladki += `<button type="button" class="btn btn-secondary"onClick="edytujZadanie()" >Edit</button>`;

    for (let i = 0; i < obiekt.length; i++) {
        zakladki += `<button type="button" class="btn btn-primary"onClick="wlaczZadanie('${obiekt[i].Title}')" >${obiekt[i].Title}</button>`;
    }
    zakladki += `</div>`;
    $('#zakladki').html(zakladki);
}

function zapiszZadanie() {

    let key = sessionStorage.key(0) + "_todo";

    let Title = $('#InputTitle').val();
    let Task = $('#InputTask').val();
    let TaskURL = $('#InputImage').val();

    var obiekt;
    if (localStorage.hasOwnProperty(key)) {
        obiekt = JSON.parse(localStorage.getItem(key));
    } else {
        obiekt = [];
    }

    if (!checkIsCorrect(Title, Task))
        return;

    for (let i = 0; i < obiekt.length; i++) {
        if (obiekt[i].Title == Title) {

            window.createNotification({
                closeOnClick: true,
                displayCloseButton: true,
                positionClass: 'nfc-top-right',
                onclick: false,
                showDuration: 2000,
                theme: 'warning'
            })({
                title: 'Niepowodzenie',
                message: 'Podany tytuł zadania już istnieje!'
            });
            return false;
        }
    }


    if (!localStorage.hasOwnProperty(key)) {
        $('#box').html("Wybierz zadanie, aby zobaczyć jego treść");
    }

    var zadanie = {};
    zadanie.Title = Title;
    zadanie.Task = Task;
    zadanie.TaskURL = TaskURL;

    obiekt.push(zadanie);
    localStorage.setItem(key, JSON.stringify(obiekt));


    window.createNotification({
        closeOnClick: true,
        displayCloseButton: true,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Sukces',
        message: 'Pomyślnie dodano zadanie!'
    });

    wypiszZadania();
}