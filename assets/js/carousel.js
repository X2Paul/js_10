function Carousel(containerID = "#carousel", slideID = ".slide") {
    this.container = document.querySelector(containerID);
    this.slides = this.container.querySelectorAll(slideID);
}

Carousel.prototype = {
    _initControls() {
        const controls = document.createElement("div");
        const PAUSE =
            '<span id="pause-btn" class="control control-pause"><img class="points" src="assets/img/pause.png" alt="prev"></span>';
        const PREV =
            '<span id="prev-btn" class="control control-prev"><img class="points" src="assets/img/prev.png" alt="prev"></span>';
        const NEXT =
            '<span id="next-btn" class="control control-next"><img class="points" src="assets/img/next.png" alt="next"></span>';

        controls.setAttribute("id", "controls-container");
        controls.classList.add("controls");

        controls.innerHTML = PREV + PAUSE + NEXT;

        this.container.append(controls);

        this.pauseBtn = this.container.querySelector("#pause-btn");
        this.prevBtn = this.container.querySelector("#prev-btn");
        this.nextBtn = this.container.querySelector("#next-btn");
    },

    _initIndicators() {
        const indicators = document.createElement("div");
        indicators.setAttribute("id", "indicators-container");
        indicators.setAttribute("class", "indicators");

        for (i = 0; i < this.SLIDES_COUNT; i++) {
            const indicator = document.createElement("div");
            indicator.setAttribute("class", i ? "indicator" : "indicator active");
            indicator.dataset.slideTo = `${i}`;
            indicators.append(indicator);
        }

        this.container.append(indicators);

        this.indicatorsContainer = this.container.querySelector(
            "#indicators-container"
        );
        this.indicatorItems =
            this.indicatorsContainer.querySelectorAll(".indicator");
    },

    _initProps() {
        this.SLIDES_COUNT = this.slides.length;
        this.CODE_ARROW_LEFT = "ArrowLeft";
        this.CODE_ARROW_RIGHT = "ArrowRight";
        this.CODE_SPACE = "Space";

        this.currentSlide = 0;
        this.timerId = null;
        this.isPlaying = true;
        this.interval = 2000;
    },

    _initListeners: function () {
        this.pauseBtn.addEventListener("click", this.pausePlay.bind(this));
        this.prevBtn.addEventListener("click", this.prev.bind(this));
        this.nextBtn.addEventListener("click", this.next.bind(this));
        this.indicatorsContainer.addEventListener(
            "click",
            this._indicateHandler.bind(this)
        );
        document.addEventListener("keydown", this._pressKey.bind(this));
    },

    _goToNth(n) {
        this.slides[this.currentSlide].classList.toggle("active");
        this.indicatorItems[this.currentSlide].classList.toggle("active");
        this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
        this.slides[this.currentSlide].classList.toggle("active");
        this.indicatorItems[this.currentSlide].classList.toggle("active");
    },

    _goToPrev: function () {
        this._goToNth(this.currentSlide - 1);
    },

    _goToNext: function () {
        this._goToNth(this.currentSlide + 1);
    },

    _tick: function () {
        this.timerId = setInterval(() => this._goToNext(), this.interval);
    },

    _indicateHandler: function (e) {
        const { target } = e;
        if (target && target.classList.contains("indicator")) {
            this.pause();
            this._goToNth(+target.dataset.slideTo);
        }
    },

    _pressKey: function (e) {
        const { code } = e;
        e.preventDefault();
        if (code === this.CODE_SPACE) this.pausePlay();
        if (code === this.CODE_ARROW_LEFT) this.prev();
        if (code === this.CODE_ARROW_RIGHT) this.next();
    },

    pause: function () {
        if (!this.isPlaying) return;
        clearInterval(this.timerId);
        this.pauseBtn.innerHTML =
            '<img class="points" src="assets/img/play.png" alt="play">';
        this.isPlaying = false;
    },

    play: function () {
        this._tick();
        this.pauseBtn.innerHTML =
            '<img class="points" src="assets/img/pause.png" alt="pause">';
        this.isPlaying = true;
    },

    pausePlay: function () {
        this.isPlaying ? this.pause() : this.play();
    },

    prev: function () {
        this.pause();
        this._goToPrev();
    },

    next: function () {
        this.pause();
        this._goToNext();
    },

    init: function () {
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();
        this._tick();
    },
};