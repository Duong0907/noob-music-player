const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const progress = $("#progress");
const repeatBtn = $(".btn.btn-repeat");
const randomBtn = $(".btn.btn-random");
const toastContainer = $("#toast");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: true,
    isRepeat: true,
    randomList: [],

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    songs: [
        {
            title: "Người đừng lặng im",
            author: "Soobin",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP7tcMYwDF23FZTyR7bvOH5OyZlWaIfwsVZ49TRpEb9A&s",
            url: "/assets/audio/Xin-Dung-Lang-Im-Soobin-Hoang-Son.mp3",
        },
        {
            title: "Vì Người Không Xứng Đáng",
            author: "Tuấn Hưng",
            image: "https://i.ytimg.com/vi/4QGbQILoBrY/sddefault.jpg",
            url: "/assets/audio/Vi-Nguoi-Khong-Xung-Dang-Tuan-Hung.mp3",
        },
        {
            title: "Cớ Sao Giờ Lại Chia Xa",
            author: "Bích Phương",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRcKlNtVDG_MzpkeBQTVD-innNxv3LUAIMDEHVF5b3cg&s",
            url: "/assets/audio/Co-Sao-Gio-Lai-Chia-Xa-Bich-Phuong.mp3",
        },
        {
            title: "Đoạn Tuyệt",
            author: "Lệ Quyên",
            image: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/covers/d/c/dcbdfd74dbc950128110851f2a8689c2_1460184748.jpg",
            url: "/assets/audio/Doan-Tuyet-Le-Quyen.mp3",
        },
        {
            title: "Rực Rỡ Tháng Năm",
            author: "Mỹ Tâm",
            image: "https://karaoke.com.vn/wp-content/uploads/2018/03/H-nh-1.jpg",
            url: "/assets/audio/Ruc-Ro-Thang-Nam-My-Tam.mp3",
        },
    ],

    loadConfig: function () {
        if (localStorage.getItem("isRepeat") === "true") {
            repeatBtn.classList.add("active");
        }
        if (localStorage.getItem("isRandom") === "true") {
            randomBtn.classList.add("active");
        }
    },

    render: function () {
        const htmls = this.songs.map((song) => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url(${song.image}"></div>
                    <div class="body">
                        <div class="title">${song.title}</div>
                        <div class="author">${song.author}</div>
                        
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });

        $(".playlist").innerHTML = htmls.join("");
    },

    loadSong: function () {
        $("#audio").src = this.currentSong.url;
        $(
            ".cd-thumb"
        ).style = `background-image: url(${this.currentSong.image})`;
        $(".dashboard header h2").innerText = this.currentSong.title;
        $(".song.active")?.classList.remove("active");

        const songElements = $$(".song");
        songElements[this.currentIndex].classList.add("active");
    },

    handleScrollEvents: function () {
        const cd = $(".cd");
        const offsetWidth = cd.offsetWidth;

        document.onscroll = function () {
            const desHeight =
                window.scrollY || document.documentElement.scrollTop;
            cd.style.width = Math.max(offsetWidth - desHeight, 0) + "px";
            cd.style.opacity = cd.offsetWidth / offsetWidth;
        };
    },

    handleChoosingSongEvent: function () {
        const songElements = $$(".song");
        const _this = this;

        for (let index in songElements) {
            songElements[index].onclick = function (event) {
                _this.currentIndex = index;
                _this.loadSong();
                $("#audio").play();

                let currentSongElement = event.target;
                while (!currentSongElement?.classList?.contains("song")) {
                    currentSongElement = currentSongElement.parentElement;
                }

                _this.toast({
                    title: "Đang phát bài hát",
                    message:
                        currentSongElement.querySelector(".title").innerText,
                    type: "success",
                    duration: 3000,
                });
            };
        }
    },

    handerMusicController: function () {
        const _this = this;

        // Audio event
        audio.onplay = function () {
            _this.isPlaying = true;
            $(".player").classList.add("playing");
            cdThumbAnimate.play();
        };
        audio.onpause = function () {
            _this.isPlaying = false;
            $(".player").classList.remove("playing");
            cdThumbAnimate.pause();
        };

        audio.onended = function () {
            if (!_this.isRepeat) {
                if (!_this.isRandom) {
                    _this.playNextSong();
                } else {
                    _this.randomSong();
                }
                _this.loadSong();
            }

            audio.play();
        };

        audio.ontimeupdate = function (event) {
            const currentTime = event.target.currentTime;
            const duration = event.target.duration;

            progress.value = Math.floor((100 * currentTime) / duration);
        };

        progress.onchange = function () {
            const currentTime = (progress.value * audio.duration) / 100;
            audio.currentTime = currentTime;
        };

        repeatBtn.onclick = function (event) {
            let btn = event.target;
            while (!btn.classList.contains("btn-repeat")) {
                btn = btn.parentElement;
            }

            if (btn.classList.contains("active")) {
                btn.classList.remove("active");
                localStorage.setItem("isRepeat", false);
            } else {
                btn.classList.add("active");
                localStorage.setItem("isRepeat", true);
            }
        };

        randomBtn.onclick = function (event) {
            let btn = event.target;
            while (!btn.classList.contains("btn-random")) {
                btn = btn.parentElement;
            }

            if (btn.classList.contains("active")) {
                btn.classList.remove("active");
                localStorage.setItem("isRandom", false);
            } else {
                btn.classList.add("active");
                localStorage.setItem("isRandom", true);
            }
        };

        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 30000,
                iterations: Infinity,
            }
        );

        $(".btn-toggle-play").onclick = function (event) {
            if (!_this.isPlaying) {
                audio.play();

                _this.toast({
                    title: "Phát bài hát",
                    message: _this.songs[_this.currentIndex].title,
                    type: "success",
                    duration: 3000,
                });
            } else {
                audio.pause();

                _this.toast({
                    title: "Tạm dừng bài hát",
                    message: _this.songs[_this.currentIndex].title,
                    type: "info",
                    duration: 3000,
                });
            }
        };

        $(".btn-next").onclick = function (event) {
            _this.playNextSong();
            _this.loadSong();
            audio.play();

            _this.toast({
                title: "Đang phát bài hát",
                message: _this.songs[_this.currentIndex].title,
                type: "success",
                duration: 3000,
            });
        };

        $(".btn-prev").onclick = function (event) {
            _this.playPrevSong();
            _this.loadSong();
            audio.play();

            _this.toast({
                title: "Đang phát bài hát",
                message: _this.songs[_this.currentIndex].title,
                type: "success",
                duration: 3000,
            });
        };
    },

    handleOptions: function () {
        const _this = this;
        const songElements = $$(".song");
        for (let song of songElements) {
            console.log(song.querySelector(".option"));
            song.querySelector(".option").onclick = function (event) {
                event.stopPropagation();
                _this.toast({
                    title: "Tính năng chưa hỗ trợ bạn nhé",
                    message: "Siuuuu",
                    type: "info",
                    duration: 3000,
                });
            };
        }
    },

    playNextSong: function () {
        if (this.currentIndex < this.songs.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
    },

    playPrevSong: function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.songs.length - 1;
        }
    },

    randomSong: function () {
        const currentRandomIndex = this.randomList.findIndex((song) => {
            return song.title === this.songs[this.currentIndex].title;
        });

        this.randomList.splice(currentRandomIndex, 1);

        if (this.randomList.length === 0) {
            this.randomList = this.songs;
        }

        const size = this.randomList.length;
        const randomIndex = Math.floor(Math.random() * size);

        this.currentIndex = this.songs.findIndex((song) => {
            return song.title === this.randomList[randomIndex].title;
        });

        this.toast({
            title: "Phát ngẫu nhiên bài hát",
            message: this.songs[this.currentIndex].title,
            type: "success",
            duration: 3000,
        });
    },

    toast: function ({
        title = "",
        message = "",
        type = "info",
        duration = 3000,
    }) {
        const icons = {
            success: "fa fa-check-circle",
            info: "fa fa-info-circle",
            warning: "fa fa-exclamation-circle",
            error: "fa fa-exclamation-circle",
        };

        if (toastContainer) {
            const toast = document.createElement("div");
            toast.classList.add("toast");
            toast.innerHTML = `
                <div class="toast__icon">
                    <i class="fa ${icons[type]}" aria-hidden="true"></i>
                </div>
                <div class="toast__body">
                    <div class="toast__title">${title}</div>
                    <div class="toast__msg">${message}</div>
                </div>
                <div class="toast__close">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </div>
            `;

            const delay = (duration / 1000).toFixed(2);

            toast.classList.add(`toast--${type}`);
            toast.style.animation = `slideInLeft ease .1s, fadeOut linear 1s ${delay}s forwards`;

            toastContainer.appendChild(toast);

            const autoRemoveId = setTimeout(() => {
                toastContainer.removeChild(toast);
            }, duration + 1000);

            toast.querySelector(".toast__close").onclick = function () {
                toastContainer.removeChild(toast);
                clearTimeout(autoRemoveId);
            };
        }
    },

    start: function () {
        this.randomList = this.songs.slice();
        this.defineProperties();
        this.loadConfig();
        this.render();
        this.loadSong();

        this.handleScrollEvents();
        this.handleChoosingSongEvent();
        this.handerMusicController();
        this.handleOptions();
    },
};

app.start();
