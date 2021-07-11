/*jshint esversion: 6 */
$(document).ready(function() {

    n = new Date();
    y = n.getFullYear();
    m = ("0" + (n.getMonth() + 1)).slice(-2);
    d = ("0" + n.getDate()).slice(-2);
    $('#InputDate').val(y + "-" + m + "-" + d);

    let key = sessionStorage.key(0) + "_rachunki";

    if (localStorage.hasOwnProperty(key)) {
        $('#box').html("Wybierz rachunek, aby zobaczyć szczegóły");
    } else {
        $('#box').html("Dodaj rachunek, aby móc go wybrać");
    }
    wypiszRachunki();
});

let openedBill = -1;

function zamknij() {
    $('#modalDelete').modal('hide');
    $('#modalEdit').modal('hide');
    $('#modalPodsumowanie').modal('hide');
}

function mode(arr) {
    return arr.sort((a, b) =>
        arr.filter(v => v === a).length -
        arr.filter(v => v === b).length
    ).pop();
}

function podsumowanie() {

    let key = sessionStorage.key(0) + "_rachunki";
    let mostCommonShop = [];
    let mostCommonPayment = [];
    var obiekt = JSON.parse(localStorage.getItem(key));
    let price = 0;
    let priceMonth = 0;
    let a = new Date();
    let thisMonth = new Date(a.getFullYear(), a.getMonth(), 1, 0, 0, 0);
    let Data;

    for (let i = 0; i < obiekt.length; i++) {
        price += parseFloat(obiekt[i].Price);
        mostCommonShop.push(obiekt[i].Shop);
        mostCommonPayment.push(obiekt[i].Payment);
        Data = new Date(obiekt[i].Data);

        if (Data > thisMonth) {
            priceMonth += parseFloat(obiekt[i].Price);
        }
    }

    let shop = mode(mostCommonShop);
    let payment = mode(mostCommonPayment);

    var zawartosc = `Łączny koszt rachunków: ${price} zł</br>`;
    zawartosc += `Łączny koszt rachunków w obecnym miesiącu: ${priceMonth} zł</br>`;
    if (shop != "0") zawartosc += `Najczęściej kupowano w: ${shop}</br>`;
    if (payment != "0") {
        if (payment == 1) zawartosc += "Najczęściej płacono: Gotówka";
        else if (payment == 2) zawartosc += "Najczęściej płacono: Karta";
        else if (payment == 3) zawartosc += "Najczęściej płacono: Blik";

    }

    $('#PodsumowanieContener').html(zawartosc);
    $('#modalPodsumowanie').modal('show');
}

function deleteRachunek() {

    let key = sessionStorage.key(0) + "_rachunki";

    var obiekt = JSON.parse(localStorage.getItem(key));
    obiekt.splice(openedBill, 1);
    localStorage.setItem(key, JSON.stringify(obiekt));

    if (obiekt.length == 0) localStorage.removeItem(key);


    if (localStorage.hasOwnProperty(key)) {
        $('#box').html("Wybierz rachunek, aby zobaczyć szczegóły");
    } else {
        $('#box').html("Dodaj rachunek, aby móc go wybrać");
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
        message: 'Pomyślnie usunięto rachunek!'
    });

    $('#przycisk').html("");

    zamknij();
    wypiszRachunki();
}

function checkIsCorrect(Title, Data, Price) {

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
            message: 'Brak tytułu!'
        });
        return false;
    }

    var now = new Date();
    if (Data > now) {
        window.createNotification({
            closeOnClick: true,
            displayCloseButton: true,
            positionClass: 'nfc-top-right',
            onclick: false,
            showDuration: 2000,
            theme: 'warning'
        })({
            title: 'Niepowodzenie',
            message: 'Wprowadzona data jest z przyszłości!'
        });
        return false;
    }

    if (isNaN(Price) || parseFloat(Price) <= 0 || Price == "") {

        window.createNotification({
            closeOnClick: true,
            displayCloseButton: true,
            positionClass: 'nfc-top-right',
            onclick: false,
            showDuration: 2000,
            theme: 'warning'
        })({
            title: 'Niepowodzenie',
            message: 'Wprowadzona kwota jest niepoprawna!'
        });
        return false;
    }
    return true;
}

function edytujRachunek() {
    let key = sessionStorage.key(0) + "_rachunki";
    var obiekt = JSON.parse(localStorage.getItem(key));

    let EditTextInModal = $('#formularz').html();
    EditTextInModal = EditTextInModal.substring(0, EditTextInModal.length - 129);
    EditTextInModal = EditTextInModal.replaceAll("InputTitle", "InputTitle1");
    EditTextInModal = EditTextInModal.replaceAll("InputDate", "InputDate1");
    EditTextInModal = EditTextInModal.replaceAll("InputPrice", "InputPrice1");
    EditTextInModal = EditTextInModal.replaceAll("Check1", "Check11");
    EditTextInModal = EditTextInModal.replaceAll("Check2", "Check22");
    EditTextInModal = EditTextInModal.replaceAll("Check3", "Check33");
    EditTextInModal = EditTextInModal.replaceAll("Radio1", "Radio11");
    EditTextInModal = EditTextInModal.replaceAll("Radio2", "Radio22");
    EditTextInModal = EditTextInModal.replaceAll("Radio3", "Radio33");
    EditTextInModal = EditTextInModal.replaceAll("SelectShop", "SelectShop1");
    EditTextInModal = EditTextInModal.replaceAll("InputBill", "InputBill1");

    $('#modalEdit').modal('show');
    $('#EditTextInModal').html(EditTextInModal);
    $('#InputTitle1').val(obiekt[openedBill].Title);

    var n = new Date(obiekt[openedBill].Data);
    y = n.getFullYear();
    m = ("0" + (n.getMonth() + 1)).slice(-2);
    d = ("0" + n.getDate()).slice(-2);

    $('#InputDate1').val(y + "-" + m + "-" + d);
    $('#InputPrice1').val(obiekt[openedBill].Price);


    $('#Radio' + obiekt[openedBill].Payment + obiekt[openedBill].Payment).prop('checked', true);

    let whichShop = 0;

    switch (obiekt[openedBill].Shop) {
        case 'Auchan':
            whichShop = 1;
            break;
        case 'Biedronka':
            whichShop = 2;
            break;
        case 'Carrefour':
            whichShop = 3;
            break;
        case 'Lidl':
            whichShop = 4;
            break;
        case 'Stokrotka':
            whichShop = 5;
            break;
        case 'Tesco':
            whichShop = 6;
            break;
        case 'Żabka':
            whichShop = 7;
            break;
    }

    switch (obiekt[openedBill].Products) {
        case 1:
            document.getElementById("Check33").checked = true;
            break;
        case 2:
            document.getElementById("Check22").checked = true;
            break;
        case 3:
            document.getElementById("Check22").checked = true;
            document.getElementById("Check33").checked = true;
            break;
        case 4:
            document.getElementById("Check11").checked = true;
            break;
        case 5:
            document.getElementById("Check11").checked = true;
            document.getElementById("Check33").checked = true;
            break;
        case 6:
            document.getElementById("Check11").checked = true;
            document.getElementById("Check22").checked = true;
            break;
        case 7:
            document.getElementById("Check11").checked = true;
            document.getElementById("Check22").checked = true;
            document.getElementById("Check33").checked = true;
            break;
    }

    $('#SelectShop1').val(whichShop);

    $('#InputBill1').val(obiekt[openedBill].BillURL);
}

function confirmEdit() {
    let key = sessionStorage.key(0) + "_rachunki";
    var obiekt = JSON.parse(localStorage.getItem(key));

    let Title = $('#InputTitle1').val();
    let Data = new Date($('#InputDate1').val());
    let Price = $('#InputPrice1').val();

    let Products = 0;
    if ($('#Check11').is(':checked')) Products += 4;
    if ($('#Check22').is(':checked')) Products += 2;
    if ($('#Check33').is(':checked')) Products += 1;

    let Payment = 0;
    if ($('#Radio11').is(':checked')) Payment = 1;
    if ($('#Radio22').is(':checked')) Payment = 2;
    if ($('#Radio33').is(':checked')) Payment = 3;


    let Shop = $('#SelectShop1 option:selected').text();
    if (Shop == "Wybierz sklep:") Shop = 0;

    let BillURL = $('#InputBill1').val();

    if (!checkIsCorrect(Title, Data, Price)) return;

    let id = 0;
    var rachunek = {};
    let unikalny = 0;
    while (!unikalny) {
        unikalny = 1;
        id = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        for (let i = 0; i < obiekt.length; i++) {
            if (obiekt[i].id == id()) {
                unikalny = 0;
                break;
            }
        }
    }

    rachunek.id = id();
    rachunek.Title = Title;
    rachunek.Data = Data;
    rachunek.Price = Price;
    rachunek.Products = Products;
    rachunek.Payment = Payment;
    rachunek.Shop = Shop;
    rachunek.BillURL = BillURL;

    obiekt[openedBill] = rachunek;
    localStorage.setItem(key, JSON.stringify(obiekt));

    wypiszRachunki();
    wlaczRachunek(rachunek.id);

    window.createNotification({
        closeOnClick: true,
        displayCloseButton: true,
        positionClass: 'nfc-top-right',
        onclick: false,
        showDuration: 2000,
        theme: 'success'
    })({
        title: 'Sukces',
        message: 'Pomyślnie edytowano rachunek!'
    });

    zamknij();
}


function usunRachunek(TitleToDelete, number) {

    openedBill = number;

    $('#TitleOfTask').text(TitleToDelete);
    $('#modalDelete').modal('show');
}

function wlaczRachunek(idToShow) {
    let key = sessionStorage.key(0) + "_rachunki";
    var obiekt = JSON.parse(localStorage.getItem(key));
    let number = 0;
    for (let i = 0; i < obiekt.length; i++) {
        if (obiekt[i].id == idToShow) {
            number = i;
            break;
        }
    }
    var SliceData = obiekt[number].Data.slice(0, obiekt[number].Data.indexOf('T'));
    var przycisk = `<button type="button" class="btn-close btn-close-white" onClick="usunRachunek('${obiekt[number].Title}','${number}')"   ></button>`;

    openedBill = number;

    var tekst = `</br>Data: ${SliceData}</br>
                Cena: ${obiekt[number].Price} zł</br>`;

    if (obiekt[number].Products == 0) tekst += "Produkty: Nie podano";
    else if (obiekt[number].Products == 1) tekst += "Produkty: Usługi";
    else if (obiekt[number].Products == 2) tekst += "Produkty: Chemia";
    else if (obiekt[number].Products == 3) tekst += "Produkty: Chemia i Usługi";
    else if (obiekt[number].Products == 4) tekst += "Produkty: Spożywcze";
    else if (obiekt[number].Products == 6) tekst += "Produkty: Spożywcze i Chemia";
    else if (obiekt[number].Products == 7) tekst += "Produkty: Spożywcze, Chemia i Usługi";
    tekst += "</br>";
    if (obiekt[number].Payment == 0) tekst += "Płatność: Nie podano";
    else if (obiekt[number].Payment == 1) tekst += "Płatność: Gotówka";
    else if (obiekt[number].Payment == 2) tekst += "Płatność: Karta";
    else if (obiekt[number].Payment == 3) tekst += "Płatność: Blik";
    tekst += "</br>";
    if (obiekt[number].Shop == 0) tekst += "Sklep: Nie podano";
    else tekst += `Sklep: ${obiekt[number].Shop}`;
    tekst += "</br></br>";
    if (obiekt[number].BillURL != "") {

        var pokazzdjecie = `<div id="zdjecieRachunku"><a href="${obiekt[number].BillURL}" data-lightbox="galeria" data-title="Rachunek: ${obiekt[number].Title}"><img src="images/pokazRachunek.png" alt="Rachunek"/></a>`;
        tekst += pokazzdjecie;
        tekst += `</div>`;

        $('#zdjecieRachunku').html(pokazzdjecie);
    } else {
        $('#zdjecieRachunku').html("");
    }

    $('#przycisk').html(przycisk);
    $('#box').html(tekst);


    wypiszRachunki();
}

function wypiszRachunki() {
    let key = sessionStorage.key(0) + "_rachunki";
    var obiekt;
    if (localStorage.hasOwnProperty(key)) {
        obiekt = JSON.parse(localStorage.getItem(key));
    } else {
        let zakladki = "";
        $('#zakladki').html(zakladki);
        $('#przyciskPodsumowania').html("");
        return;
    }

    if (obiekt.length == 0) {
        $('#przyciskPodsumowania').html("");
        return;
    }

    var przyciskPodsumowania = `<button type="button" class="btn btn-primary"onClick="podsumowanie()" >Sporządź Zestawienie</button>`;
    $('#przyciskPodsumowania').html(przyciskPodsumowania);

    let zakladki = `<br><div class="btn-group-vertical" role="group">`;

    if ($('#box').html() != "Wybierz rachunek, aby zobaczyć szczegóły" && $('#box').html() != "Dodaj rachunek, aby móc go wybrać")
        zakladki += `<button type="button" class="btn btn-secondary"onClick="edytujRachunek()" >Edit</button>`;


    for (let i = 0; i < obiekt.length; i++) {
        zakladki += `<button type="button" class="btn btn-primary"onClick="wlaczRachunek('${obiekt[i].id}')" >${obiekt[i].Title}</button>`;
    }
    zakladki += `</div>`;


    $('#zakladki').html(zakladki);

}

function saveBill() {

    let key = sessionStorage.key(0) + "_rachunki";

    let Title = $('#InputTitle').val();
    let Data = new Date($('#InputDate').val());
    let Price = $('#InputPrice').val();

    let Products = 0;
    if ($('#Check1').is(':checked')) Products += 4;
    if ($('#Check2').is(':checked')) Products += 2;
    if ($('#Check3').is(':checked')) Products += 1;

    let Payment = 0;
    if ($('#Radio1').is(':checked')) Payment = 1;
    if ($('#Radio2').is(':checked')) Payment = 2;
    if ($('#Radio3').is(':checked')) Payment = 3;


    let Shop = $('#SelectShop option:selected').text();
    if (Shop == "Wybierz sklep:") Shop = 0;

    let BillURL = $('#InputBill').val();
    var obiekt;
    if (localStorage.hasOwnProperty(key)) {
        obiekt = JSON.parse(localStorage.getItem(key));
    } else {
        obiekt = [];
    }

    if (!checkIsCorrect(Title, Data, Price)) return;

    let id = 0;
    var rachunek = {};
    let unikalny = 0;
    while (!unikalny) {
        unikalny = 1;
        id = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        for (let i = 0; i < obiekt.length; i++) {
            if (obiekt[i].id == id()) {
                unikalny = 0;
                break;
            }
        }
    }

    rachunek.id = id();
    rachunek.Title = Title;
    rachunek.Data = Data;
    rachunek.Price = Price;
    rachunek.Products = Products;
    rachunek.Payment = Payment;
    rachunek.Shop = Shop;
    rachunek.BillURL = BillURL;

    obiekt.push(rachunek);
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
        message: 'Pomyślnie dodano rachunek!'
    });

    wypiszRachunki();
}