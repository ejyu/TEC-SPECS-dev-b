import { freePc } from './pcs.js';
import { breakPc } from './pcs.js';
import { fixPc } from './pcs.js';
import { printPcStatus } from './pcs.js';
import { initPcs } from './pcs.js';
import { reservePcs } from './pcs.js';
import { scanId } from './pcs.js';


//TEST SUITE MADE ASSUMING numPcs = 5
//esportsMap = {'A12345': 'Splatoon Gold', 'A5678': 'Splatoon Gold', 'A0000': 'Overwatch', 'A1111': 'Overwatch'}

console.log("Average Day At TEC");
initPcs();
test1();

initPcs();
test2();

initPcs();
test3();

initPcs();
test4();

initPcs();
test5();

//if this doesnt cause a runtime error then code should be good :)
initPcs();
test4(); wait(1);
test2(); wait(1);
test5(); wait(1);
test3(); wait(1);
test1(); wait(1);

function wait(seconds){
    let time = Date.now();
    while(Date.now() < time + seconds*1000){
        ;
    }
}

//basic use and free
function test1(){
    console.log("TEST 1");
    scanId('ABCDE'); wait(1);
    scanId('ABCDE'); wait(1);
    printPcStatus();
}

//more advanced use - all PCs used and Freed
function test2(){
    console.log("TEST 2");
    scanId('12345'); wait(1);
    scanId('23456'); wait(1);
    scanId('34567'); wait(1);
    scanId('45678'); wait(1);
    scanId('56789'); wait(1);
    scanId('67890'); wait(1);
    printPcStatus();
    wait(1);
    scanId('12345'); wait(1);
    scanId('23456'); wait(1);
    scanId('34567'); wait(1);
    scanId('45678'); wait(1);
    scanId('56789'); wait(1);
}

//use and frees out of order
function test3(){
    console.log("TEST 3");
    scanId('00'); wait(1); scanId('1'); wait(1); scanId('2'); wait(1); scanId('1'); wait(1);
    scanId('3'); wait(1); scanId('4'); wait(1); scanId('5'); wait(1); scanId('6'); wait(1);
    scanId('7'); wait(1); scanId('00'); wait(1); scanId('8'); wait(1); scanId('1'); wait(1);
}

//use and frees w/ broken PCs :(
function test4(){
    console.log("TEST 4");
    breakPc(3); wait(1); scanId('ABCD'); wait(1);
    scanId('1234'); wait(1); breakPc(0); wait(1); scanId('ABCD'); wait(1);
    fixPc(0); wait(1); scanId('ABCD'); wait(1); scanId('4'); wait(1);
    scanId('5'); wait(1); scanId('6'); wait(1); scanId('7'); wait(1);
    printPcStatus();
}

//reservation system, PCs 0 and 1 will be reserved
function test5(){
    console.log("TEST 5");
    let time = Date.now();
    reservePcs([0, 1], 'Splatoon Gold', time + 5000, time + 36000);
    wait(6);
    test3();
    wait(1);
    scanId('A1234');
    printPcStatus();
}
