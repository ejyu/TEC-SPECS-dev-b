import { numPcs } from "./layout.js";
import { esportsMap } from "./esports_ids.js";

const PLAY_TIME_MIN = 0.25; //players get this many minutes before being booted, unless the PCs have been reserved
const RESERVE_TIME_MIN = 3 //the app will not assign a reserved pc this many minutes before the reservation time
const RESERVE_TIME_REJECT = 3; //seconds; amount of time where a reservation is deemed too close to the current time

//Set of {num: [pc Number], time: [timestamp of addition to the queue]}
let openPcQueue;
let inUsePcQueue;
let brokenPcSet;

//Map of [pcNum] => {game: [name of game], start: [start time], end: [end time]}
let reservedPcMap;

function initPcs(){
    console.log("Initializing");
    openPcQueue = new Set();
    inUsePcQueue = new Set();
    brokenPcSet = new Set();
    reservedPcMap = new Map();
    for (let i = 0; i < numPcs; i++){
        openPcQueue.add({num: i, time: Date.now(), id: 0});
    }
}

function scanId(id){
    for(let value of inUsePcQueue){
        if(value.id == id){
            console.log("PC " + value.num + " freed by " + id);
            freePcById(id);
            return;
        }
    }
    assignPc(id);
}

function assignPc(id){
    if(checkReservations(id)){
        return;
    }

    for(let value of openPcQueue){
        openPcQueue.delete(value);
        value.time = Date.now();
        value.id = id;
        inUsePcQueue.add(value);
        console.log("FREE PC: " + value.num)
        return true;
    }
    let time = Date.now();
    let use_time = 0;
    let time_remaining = 0;
    for(let value of inUsePcQueue){
        use_time = time - value.time;
        if((use_time/60000) > PLAY_TIME_MIN){
            console.log("TIME IS UP FOR USER AT PC " + value.num);
            inUsePcQueue.delete(value);
            value.time = Date.now();
            value.id = 0;
            inUsePcQueue.add(value);
            return true;
        }
        break;
    }
    if(use_time != 0){
        time_remaining = PLAY_TIME_MIN*60 - use_time/1000;
    }
    for(let [pc, res] of reservedPcMap){
        if(time > res.start && time < res.end){
            if(res.end - time < time_remaining*1000 || time_remaining == 0){
                time_remaining = (res.end - time)/1000;
            }
        }
    }
    if(time_remaining == 0){
        console.log("No PCs availalble!");
    }
    else{
        console.log("No PCs available, next opening in: " + time_remaining + " seconds");
    }
    return false;
}

function freePcById(id){
    for(let value of inUsePcQueue){
        if(value.id == id){
            inUsePcQueue.delete(value);
            value.time = Date.now();
            value.id = 0;
            openPcQueue.add(value);
        }
    }
}

function freePc(pcNum){
    for(let value of inUsePcQueue){
        if(value.num == pcNum){
            inUsePcQueue.delete(value);
            value.time = Date.now();
            openPcQueue.add(value);
            break;
        }
    }
}

function breakPc(pcNum){
    for(let value of openPcQueue){
        if (value.num == pcNum){
            openPcQueue.delete(value);
            value.time = Date.now();
            brokenPcSet.add(value);
            return;
        }
    }
    for(let value of inUsePcQueue){
        if (value.num == pcNum){
            inUsePcQueue.delete(value);
            value.time = Date.now();
            value.id = 0;
            brokenPcSet.add(value);
            return;
        }
    }
}

function fixPc(pcNum){
    for(let value of brokenPcSet){
        if(value.num == pcNum){
            brokenPcSet.delete(value)
            break;
        }
    }
    openPcQueue.add({num: pcNum, time: Date.now()});
}

function reservePcs(pcs, team, startTime, endTime){
    if((startTime - Date.now())/1000 < RESERVE_TIME_REJECT){
        console.log("Reservation Rejected!")
        return;
    }
    let pc;
    while(pcs.length > 0){
        pc = pcs.pop();
        reservedPcMap.set(pc, {team: team, start: startTime, end:endTime});
        console.log("Reservation confirmed for " + team);
    }
}

function checkReservations(id){
    let time = Date.now();
    for(let value of openPcQueue){
        if(reservedPcMap.has(value.num)){
            if(reservedPcMap.get(value.num).start - RESERVE_TIME_MIN*60000 < time &&
            reservedPcMap.get(value.num).end > time){
                openPcQueue.delete(value);
            }

            else if(reservedPcMap.get(value.num).end < time){
                reservedPcMap.delete(value.num);
            }
        }
    }
    let pc_reserve = [];
    for(let [num, res] of reservedPcMap){
        if(res.end < time){
            openPcQueue.add({num: num, time: time});
            reservedPcMap.delete(num);
        }
        else if(res.start < time && res.end > time && esportsMap.has(id) && esportsMap.get(id) == res.team){
            pc_reserve.push(num);
        }
    }

    if(pc_reserve.length > 0){
        console.log("PCs reserved for " + esportsMap.get(id) + ": " + pc_reserve);
        return true;
    }
    return false;
}


function printPcStatus(){
    checkReservations(-1);
    let time = Date.now();
    console.log("--------------------------------------");
    for(let value of openPcQueue){
        let pcTimeS = (time - value.time)/1000;
        console.log("PC " + value.num + " has been free for " + pcTimeS + " seconds");
    }
    for(let value of inUsePcQueue){
        let pcTimeS = (time - value.time)/1000;
        console.log("PC " + value.num + " has been in use for " + pcTimeS + " seconds");
    }
    for(let value of brokenPcSet){
        let pcTimeS = (time - value.time)/1000;
        console.log("PC " + value.num + " has been inoperable for " + pcTimeS + " seconds");
    }
    for(let [num, res] of reservedPcMap){
        let res_time = res.end - res.start;
        let res_time_s = res_time/1000;
        console.log("PC " + num + " is reserved for " + res.team + " for " + res_time_s + "s in " + (res.start-time)/1000 + " seconds");
    }
    console.log("-------------------------------------");
}

export { freePc }
export { breakPc }
export { fixPc }
export { printPcStatus }
export { initPcs }
export { reservePcs }
export { scanId }