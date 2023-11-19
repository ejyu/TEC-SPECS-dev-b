// let numPcs = 3;
// export { numPcs };

/* Note: Everything below is for counting max num of PCs in the space. */

let numPcs = 0;

let row = document.querySelectorAll('tr').length;
let column = (document.querySelectorAll('td').length)/row;

console.log('Rows: ' + row);
console.log('Columns: ' + column);

for (var i = 0; i < row; i++) {
    for (var j = 0; j < column; j++) {
        var dataCell = document.getElementById('cell-' + i + '-' + j);
        if ( !(dataCell.innerText == "" || (dataCell.getAttribute('pc'))) ) {
            numPcs++;
        }
    }
}

export { 
    numPcs
};