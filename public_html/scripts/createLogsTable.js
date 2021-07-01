var allInfo;
var currentidx = 1; // 1-indexed, the first entry FROM THE REVERSE that is to be shown.
var numEntriesEachPage = 3;
function displayTable(allInfo, startidx){
    var logsTable = document.getElementById("logstable");
    for (var entry of logsTable.querySelectorAll("tr")){
        if (entry.querySelectorAll("th").length == 0) logsTable.removeChild(entry);
    }
    for (var i = 0; i < numEntriesEachPage; i++){
        var actualIdx = allInfo.length-(startidx+i);
        if (actualIdx < 0) break;
        var currentEntry = allInfo[actualIdx]; // data, description, points

        var entryTr = document.createElement("tr");
        var dateTd = document.createElement("td");
        dateTd.innerHTML = currentEntry[0];
        var taskTd = document.createElement("td");
        taskTd.innerHTML = currentEntry[1];
        var pointsTd = document.createElement("td");
        var pointsDisplay = currentEntry[2]; 
        if (currentEntry[2][0] != '-') pointsDisplay = '+' + pointsDisplay;
        pointsDisplay += " points";
        pointsTd.innerHTML = pointsDisplay;

        if (currentEntry[2][0] === '-') entryTr.className = "subtractpoints";
        else entryTr.className = "addpoints";
        entryTr.appendChild(dateTd);
        entryTr.appendChild(taskTd);
        entryTr.appendChild(pointsTd);
        logsTable.appendChild(entryTr);
    }
}

function updatePageNumberDiv(allInfo, currentidx){
    var currPage = Math.floor(currentidx / numEntriesEachPage) + 1;
    var totalPages = Math.floor((allInfo.length-1) / numEntriesEachPage) + 1;
    var pageNumberDivs = document.getElementsByClassName("pagenav");
    for (var pageNumberDiv of pageNumberDivs){
        pageNumberDiv.querySelector(".pagenumber").innerHTML = "Page " + currPage + "/" + totalPages;
        pageNumberDiv.querySelector(".leftarrowbutton").disabled = (currPage === 1);
        pageNumberDiv.querySelector(".rightarrowbutton").disabled = (currPage === totalPages);
    }
}

function advancePage(byHowMany){
    currentidx += byHowMany*numEntriesEachPage;
    displayTable(allInfo, currentidx);
    updatePageNumberDiv(allInfo, currentidx);
}

function createLogsTable(platoon){
    currentidx = 1;
    allInfo = readCsv("pointsLogs/" + platoon + '.csv');
    displayTable(allInfo, currentidx);
    updatePageNumberDiv(allInfo, currentidx);
}

window.onload = function(){
    createLogsTable("epsilon");
    document.getElementById("platoon").addEventListener("change", function(){
        createLogsTable(this.value.toLowerCase());
    });
};