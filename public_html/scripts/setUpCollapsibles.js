function calculatePercentageOfImageCards(widthCards=200){
    var clientWidth = document.documentElement.clientWidth;
    var numCards = Math.floor((clientWidth*0.75)/widthCards);
    return 100 / numCards;
}

function setWidthImageCards(){
    var percentage = calculatePercentageOfImageCards();
    for (var mainResource of document.getElementsByClassName("resourcesDiv")){
        for (var elem of mainResource.querySelectorAll(".imagecard")){
            elem.style.width = percentage + "%";
            elem.style.height = 'auto';
        }
        alignCardsHeight(mainResource);
        for (var elem of mainResource.querySelectorAll(".imagecard")){
          elem.parentElement.style.maxHeight = elem.parentElement.style.maxHeight ? elem.parentElement.scrollHeight + "px" : null;
        }
    }
}

function alignCardsHeight(mainResource){
    // flexbox doesn't work (doesn't give table format), no choice but to brute
    var maxHeight = 0;
    for (var elem of mainResource.querySelectorAll(".imagecard")){
        maxHeight = Math.max(elem.clientHeight, maxHeight);
    }
    for (var elem of mainResource.querySelectorAll(".imagecard")){
        elem.style.height = maxHeight + "px";
    }
}

window.onresize = setWidthImageCards;
window.onload = function(){
    var coll = document.getElementsByClassName("collapsible");

    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            } 
        });
    }
    setWidthImageCards();
};