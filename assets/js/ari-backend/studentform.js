import { scanId } from './pcs.js';

let form = document.getElementById("scan_form");
form.addEventListener("submit", e => {performScan(e)});


function performScan(e){
    let data = Object.fromEntries(new FormData(e.target).entries());
    let id = data.studentIdentificationString;
    location.href = 'index.html#studentSignOn';
    console.log(id);
    let status = scanId(id);
    if(status[0] == 0){
        displayLogout(status[1]);
    }
    else{
        let pcInfo = status[0];
        let displayStr = "";
        switch (status[1]){
            case 0:
            case 1:
                directUserToPc(pcInfo, status[1]);
                break;
            case 2:
                directUserToReservation(pcInfo);
                break;
            case 3:
            case 4:
            default:
                noPcError(pcInfo, status[1]);
        }
    }
}

function directUserToPc(num, code){
    let str;
    if (code == 0){
        str = ""
    }
}
