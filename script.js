var currentID = 0;
var audio = new Audio();
var stopLoop = false;
var src = null;

var songs = [
    {
        "id": 0,
        "album": "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_2.jpg",
        "mp3": "audio/1.mp3",
        "title": "Me & You",
        "by": "Uplink & Alex Skrindo"
    }
]

window.onload = function () {
    var track = $('#track')
    track.css('background-image', `url('${songs[currentID].album}')`)
}

$('#play-pause-button').on("click", function (e) {
    // console.log(e);
    var div = $(e.currentTarget)
    var i = $(div).find('i')
    var isPlaying = !audio.paused
    // console.log(isPlaying);
    if(!isPlaying) {
        player("play");
    } else {
        player("pause");
    }    
})

$('#play-previous').on('click', function (e) {
    console.log(e);
    player("previous")
})

$('#play-next').on('click', function (e) {
    var div = $(e.currentTarget)
    var i = $(div).find('i')
    player("next")
})

function player(action) {
    var i = $('#play-pause-button i')
    var track = $('#track')
    var popup = $('#player-track')
    if(action == "play") {

        // Return to first song
        if(currentID >= songs.length) currentID = 0
        else if(currentID < 0) currentID = 0

        // Get the current song
        var {album, mp3, title, by} = songs[currentID]

        // Open song popup with name & artist
        popup.addClass("active")

        // Changep play/pause icon
        i.removeClass()
        i.addClass("fa fa-pause")

        // Add rotation to img
        track.addClass("rotate")

        // song popup information
        $('#album-name').text(title)
        $('#track-name').text(by)

        // Change background of the spinning track
        track.css('background-image', `url('${album}')`)

        // Play song
        audio.src = mp3
        audio.play()

        // Start the shadow
        bass()
    } else if (action == "pause") {
        // Classes pause
        i.removeClass()
        i.addClass("fa fa-play")
        track.removeClass("rotate")

        popup.removeClass("active")
        audio.pause()
        stopLoop = true
    } else if(action == "next") {
        currentID++
        player("play")
    } else if(action == "previous") {
        currentID--
        player("play")
    }
}

audio.onended = function () {
    currentID++
    player("play")
}

function bass() {
    stopLoop = false
    var context = new AudioContext();
    var analyser = context.createAnalyser();
    // console.log(audio);

    if (src != audio) {
        src = context.createMediaElementSource(audio);
        src.connect(analyser);
    }

    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    // console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var maxDepth = 160; // px

    function renderFrame() {
        if(!stopLoop) requestAnimationFrame(renderFrame);
        analyser.getByteFrequencyData(dataArray);

        var depth = dataArray[1] - maxDepth
        if (depth < 20) {depth = 20}

        if(!stopLoop) $("#player-content").css("box-shadow", `0 30px ${depth}px #ada0a5`)
        else {
            $("#player-content").css("box-shadow", `0 30px 80px #ada0a5`)
        }
    }
    renderFrame()
    
}