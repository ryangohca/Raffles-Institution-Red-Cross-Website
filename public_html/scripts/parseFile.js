/* from https://gist.github.com/Jezternz/c8e9fafc2c114e079829974e3764db75 */
const csvStringToArray = strData =>
{
    const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ? 
            arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
            arrMatches[3]);
    }
    return arrData;
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var result = null;
    rawFile.open("GET", file, false);
    rawFile.send();
    if(rawFile.status === 200 || rawFile.status == 0){
        result = rawFile.responseText;
    }
    return result;
}

// csv easier to do for now.
function readCsv(filepath){
    var allInfo = readTextFile(filepath).split('\n');
    var processed = []
    for (var csvstr of allInfo){
        processed.push(csvStringToArray(csvstr)[0]);
    }
    return processed;
}