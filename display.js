/*Определяет идентификаторы элементов видео и кнопки на странице*/

class VideoPlayer {
    constructor(myVideo, myBtn) {
        this.video = document.getElementById(myVideo);
        this.btn = document.getElementById(myBtn);
        this.btn.addEventListener("click", () => this.togglePlayPause());
    }
  
  /*Проверяет, находится видео в состоянии паузы и проигрыванияю. В зависимости от ответа выполняет соответствующие функции*/
  
    togglePlayPause() {
        if (this.video.paused) {
            this.play();
        } else {
            this.pause();
        }
    }
  
    play() {
        this.video.play();
        this.btn.innerHTML = "Pause";
    }
  
    pause() {
        this.video.pause();
        this.btn.innerHTML = "Play";
    }
  }
  
  /*Создет экзепляр класса с видео и кнопкой*/
  
  const myVideoPlayer = new VideoPlayer("myVideo", "myBtn");
