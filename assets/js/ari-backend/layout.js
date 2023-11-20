// let numPcs = 3;
// export { numPcs };

/* Note: Everything below is for counting max num of PCs in the space. */

let numPcs = 0;
let pcMap = new Map();

let row = document.querySelectorAll('tr').length;
let column = (document.querySelectorAll('th').length)/row;

console.log('Rows: ' + row);
console.log('Columns: ' + column);

for (var i = 0; i < row; i++) {
    for (var j = 0; j < column; j++) {
        var dataCell = document.getElementById('cell-' + i + '-' + j);
        if ( !(dataCell.innerText == "" || (dataCell.getAttribute('pc'))) ) {
            pcMap.set(dataCell.innerText, numPcs);
            numPcs++;
            dataCell.addEventListener("click", e => {clickFunction(e)});
        }
    }
}

function clickFunction(e){
    pcNum = pcMap.get((e.srcElement.innerText));
    
}

console.log(pcMap);

export { 
    numPcs
};