/* 

1. Render songs
2. Scroll top
3. play/pause/seek 
4. CD rotate
5. Next/prev
6. Random
7. Next/repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click

*/
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY = 'Simple Music player'



const playlistNode = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cdElement = $('.cd')
const playBtn = $('.btn-toggle-play')
const playerElement = $('.player')
const progressBar = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const songElement = $('.song')
const optionElement = $('.option')
const toggleMusicListBtn = $('.btn-toggle-music-list')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Something just like this',
            singer: 'The Chainsmokers x Coldplay',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.png'
        },
        {
            name: 'I\'m the one',
            singer: 'Justin Bieber',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Good life',
            singer: 'G-Eazy',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'The Hills',
            singer: 'The weekend',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Holy',
            singer: 'Justin Bieber',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'In the name of love',
            singer: 'Martin Garrix',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpeg'
        },
        {
            name: 'Scared to be lonely',
            singer: 'Martin Garrix x Dua Lipa',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Happier',
            singer: 'Marshmello',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Wake me up',
            singer: 'Avicii',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Fly away',
            singer: 'TheFatRat',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index===this.currentIndex ? 'active': ''}" song-index="${index}">
            <div
              class="thumb"
              style="
                background-image: url('${song.image}');
              "
            ></div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })

        playlistNode.innerHTML = htmls.join('')
        // console.log(htmls.join(''))
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const cdWidth = cdElement.offsetWidth
        const _this = this
        // Xử lí CD xoay / dừng
        const cdThumbAnimation = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimation.pause()
        
        console.log(cdThumbAnimation)
        // Xử lí phóng to / thu nhỏ CD
        // document.onscroll = function () {
        //     const scrollTop = window.scrollY || document.documentElement.scrollTop
        //     // console.log(window.scrollY)
        //     const newCdWidth = cdWidth - scrollTop
        //     // console.log(newCdWidth)

        //     // Khi scroll nhanh quá thì newCdWidth sẽ âm nên code ở dưới ko chạy
        //     cdElement.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        //     cdElement.style.opacity = newCdWidth / cdWidth
        // }

        // Xử lí khi click play button
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        audio.onplay = function() {
            _this.isPlaying = true
            playerElement.classList.add('playing')
            cdThumbAnimation.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            playerElement.classList.remove('playing')
            cdThumbAnimation.pause()

        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercentage = Math.floor((audio.currentTime/audio.duration)*100)
                progressBar.value = progressPercentage
            }
        }

        // Khi user seek(tua) nhạc
        // có bug khi tua bị reset lại
        progressBar.oninput= function(e) {
            const seekedTime = e.target.value/100 * audio.duration
            audio.currentTime = seekedTime
        }

        // Khi ấn nút next/prev 
        nextBtn.onclick = function() {
            if  (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        prevBtn.onclick = function() {
            if  (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        
        // Khi ấn nút random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)   
            _this.setConfig('isRandom', _this.isRandom)     
        }
        // Khi song end
        audio.onended = function() {
            if(_this.isRepeat)
            {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Khi ấn nút repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)     

            
        }

        // when a user clicks on btn to toggle music list
        toggleMusicListBtn.onclick = function() {
            playlistNode.classList.toggle('active')
        }

        // Lắng nghe event click vào playlist
        playlistNode.onclick = function(e) {
            const unplayedSong = e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.option')

            // tìm song ko có class active
            if ( e.target.closest('.song:not(.active)') || e.target.closest('.option') ) {
                // console.log(e.target)

                // Xử lí khi click vào song 
                if(e.target.closest('.song:not(.active)')) {
                    // getAttribute returns value là string
                    _this.currentIndex = Number(unplayedSong.getAttribute('song-index'))
                    
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lí khi click vào song option
                if(e.target.closest('.option')) {
                    console.log("option clicked")
                }
            }
        }

    },

    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behaviour: 'smooth',
                block: 'nearest',

            })
        }, 300)
        // có bug khi active song ở trên đầu thì bị dashboard che mất
    },
    loadCurrentSong: function () {

        // console.log(heading, cdThumb, audio)
        heading.textContent = this.currentSong.name
        var playingSong =
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    nextSong: function() {
        this.currentIndex++
        console.log(this.currentIndex, this.songs.length)
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1 
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        do {
            var newIndex
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        console.log(this.currentIndex, this.songs.length)
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe và xử lí các sự kiện trong DOM
        this.handleEvents()

        // Tải info bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu của nút repeat và random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)   

    }
}
app.start()
