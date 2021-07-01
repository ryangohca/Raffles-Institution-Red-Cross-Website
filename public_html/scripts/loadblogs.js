var allInfo = undefined;
var toShowInfo = undefined;
currentidx = 1; // 1-indexed, the first page FROM THE REVERSE that is to be shown.

function displayBlogs(allInfo, startidx){
    var blogPostsDiv = document.getElementById("blogsdiv");
    blogPostsDiv.innerHTML = "";
    for (var i = 0; i < 3; i++){
        var actualIdx = allInfo.length-(startidx+i);
        if (actualIdx < 0) break;
        var currentBlogInfo = allInfo[actualIdx]; // name, date, title, html of rest of blog

        var newBlogDiv = document.createElement("div");
        newBlogDiv.id = "blog" + i;
        newBlogDiv.className = "blog";
        
        var blogNameDiv = document.createElement("div");
        blogNameDiv.id = "blogNameDiv";
        blogNameDiv.className = "flexcontainer";
        blogNameDiv.innerHTML = "From " + currentBlogInfo[0] + ", " + currentBlogInfo[1];

        var blogTitleDiv = document.createElement("h2");
        blogTitleDiv.innerHTML = currentBlogInfo[2];
        blogTitleDiv.className = "sectiontitle";

        newBlogDiv.appendChild(blogNameDiv);
        newBlogDiv.appendChild(blogTitleDiv);

        var htmlfile = "blogs/" + currentBlogInfo[3];
        newBlogDiv.innerHTML += readTextFile(htmlfile);
        blogPostsDiv.appendChild(newBlogDiv);
    }
}

function updatePageNumberDiv(allInfo, currentidx){
    var currPage = Math.floor(currentidx / 3) + 1;
    var totalPages = Math.floor((allInfo.length-1) / 3) + 1;
    var pageNumberDivs = document.getElementsByClassName("pagenav");
    for (var pageNumberDiv of pageNumberDivs){
        pageNumberDiv.querySelector(".pagenumber").innerHTML = "Page " + currPage + "/" + totalPages;
        pageNumberDiv.querySelector(".leftarrowbutton").disabled = (currPage === 1);
        pageNumberDiv.querySelector(".rightarrowbutton").disabled = (currPage === totalPages);
    }
}

function advancePage(byHowMany){
    // relues on global toShowInfo - the list of blogs that is to be shown, and currentidx - pointer to the first blog of the page that is shown currently.
    currentidx += byHowMany*3;
    displayBlogs(toShowInfo, currentidx);
    updatePageNumberDiv(toShowInfo, currentidx);
}

function findAvailableMonths(){
    var availableYears = new Set();
    for (var data of allInfo){
        var datadate = new Date(data[1]);
        availableYears.add(datadate.getFullYear() + " " + datadate.getMonth());
    }
    var sortedYears = [];
    for (var yearMonth of availableYears){
        var splitted = yearMonth.split(' ');
        sortedYears.push([parseInt(splitted[0]), parseInt(splitted[1])]);
    }
    sortedYears = sortedYears.sort();
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var orderedYears = {};
    for (var yearMonth of sortedYears){
        try{
            orderedYears[yearMonth[0]].push(monthNames[yearMonth[1]]);
        } catch (err){
            orderedYears[yearMonth[0]] = [monthNames[yearMonth[1]]];
        }
    }
    return orderedYears;
}

function createShowMonthList(){
    var orderedYears = findAvailableMonths();
    var elementToAppend = document.getElementById("yearlist");
    var overallList = document.createElement("ul");
    for (var year in orderedYears){
        var newYearli = document.createElement("li");
        var yearLink = document.createElement("a");
        yearLink.setAttribute("onclick", "showBlogsByMonth(" + year + ");");
        yearLink.href = "#";
        yearLink.innerHTML = year;
        newYearli.appendChild(yearLink);
        var monthList = document.createElement("ul");
        for (var month of orderedYears[year]){
            var monthli = document.createElement('li');
            var monthLink = document.createElement('a');
            monthLink.href = "#";
            monthLink.setAttribute("onclick","showBlogsByMonth(" + year + ", '" + month + "');");
            monthLink.innerHTML = month;
            monthli.appendChild(monthLink);
            monthList.appendChild(monthli);
        }
        newYearli.appendChild(monthList);
        overallList.appendChild(newYearli);
    }
    elementToAppend.appendChild(overallList);
}

function filterBlogs(year=null, month=null){
    if (year !== null) year = year.toString();
    var filteredBlogList = [];
    for (var blogData of allInfo){
        if (((year === null) || (blogData[1].search(year) !== -1)) && ((month === null) || (blogData[1].search(month) !== -1))){
            filteredBlogList.push(JSON.parse(JSON.stringify(blogData)));
        }
    }
    return filteredBlogList;
}

function updateAllPostsTitle(year=null, month=null){
    var showAllButton = document.getElementById("showallbutton");
    var allPostsTitle = document.getElementById("allpoststitle");
    if (year === null && month === null){
        showAllButton.disabled = true;
        allPostsTitle.innerHTML = "All Posts";
    } else if (month === null){
        showAllButton.disabled = false;
        allPostsTitle.innerHTML = "Posts from " + year;
    } else {
        showAllButton.disabled = false;
        allPostsTitle.innerHTML = "Posts from " + month + " " + year;
    }
}

function showBlogsByMonth(year=null, month=null){
    toShowInfo = filterBlogs(year, month);
    currentidx = 1;
    console.log(toShowInfo);
    updateAllPostsTitle(year, month);
    displayBlogs(toShowInfo, currentidx);
    updatePageNumberDiv(toShowInfo, currentidx);
}

window.onload = function(){
    if (allInfo === undefined) {
        allInfo = readCsv("blogs/blogsinfo.csv");
        console.log(allInfo);
        toShowInfo = JSON.parse(JSON.stringify(allInfo));
    }
    showBlogsByMonth();
    updateAllPostsTitle();
    createShowMonthList();
};