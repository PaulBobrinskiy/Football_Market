class Popup {
    constructor(popupId, imageId, textId) {
        /*Обращаемся к элементам*/
        this.popup = document.getElementById(popupId);
        this.popupImage = document.getElementById(imageId);
        this.popupText = document.getElementById(textId);
    }
    /*Показываем модальные окна*/
    show(imagePath) {
        this.popupImage.src = imagePath; // Устанавливаем путь к изображению
        this.popup.style.display = "block"; // Изменяем стиль display на "block"
        document.body.classList.add('blocked');
    }
    /*Закрываем модальные окна*/
    close() {
        this.popup.style.display = "none";
        document.body.classList.remove('blocked');
    }

}


// Инициализация попапов
const popup1 = new Popup("popup1", "popup-image1", "popup-text1");
const popup2 = new Popup("popup2", "popup-image2", "popup-text2");
const popup3 = new Popup("popup3", "popup-image3", "popup-text3");

// Функции для открытия попапов
function showPopup1(imagePath) {
    popup1.show(imagePath);
}

function showPopup2(imagePath) {
    popup2.show(imagePath);
}

function showPopup3(imagePath) {
    popup3.show(imagePath);
}

// Функции для закрытия попапов
function closePopup1() {
    popup1.close();
}

function closePopup2() {
    popup2.close();
}

function closePopup3() {
    popup3.close();
}
