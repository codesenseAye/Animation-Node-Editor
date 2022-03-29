let anime = require("animejs")

var introTimeline = anime.timeline({
    easing: "easeOutExpo",
    duration: 7500, // 7.5 seconds   
});

introTimeline.add({
    targets: "#path1",
    d: "M25 25 Q 12.5 0 0 0",
    delay: 1500,
    duration: 1000
})

introTimeline.add({
    targets: "#path2",
    d: "M75 25 Q 87.5 0 100 0",
    delay: 250,
    duration: 1000
})

introTimeline.add({
    targets: "#path3",
    d: "M75 75 Q 100 87.5 100 100",
    delay: 250,
    duration: 1000
})

introTimeline.add({
    targets: "#path4",
    d: "M25 75 Q 0 87.5 0 100",
    delay: 250,
    duration: 1000
})

introTimeline.add({
    targets: "#cover",
    backgroundColor: "rgba(100,100,100,0)",
    delay: 0,
    duration: 3000
})

introTimeline.add({
    targets: "#introSVG",
    transform: "scale(0)",
    delay: 1000,
    duration: 3000
})

introTimeline.finished.then(() => {
    document.getElementById("cover").style.visibility = "hidden"
})

introTimeline.seek(introTimeline.duration) // skip the end