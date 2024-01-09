/**
 * The game of SKUNK
 * 
 * Author: Mr. Brash (matthew.brash@ocsb.ca)
 * 
 * Description: This is an example of a front-end for the game
 * of chance known as SKUNK. It is played by many math and science
 * teachers to discuss chance and probability with their classes.
 * 
 * This code is freely available under the Creative Commons License,
 * feel free to modify with proper credit.
 * 
 * For my students, I did not obfuscate this particular program because
 * it was written using methods and data types we have not discussed in
 * class. As such, I am not concerned you may plagiarize from this source.
 * I would surely notice.
 */

'use strict';

const skunk = (function() {
  // Globals (yuck)
  const IMAGES = ["./images/placeholder.png", "./images/1.png", "./images/2.png", "./images/3.png", "./images/4.png", "./images/5.png", "./images/6.png"];
  const COLS = ["sScore","kScore","uScore","nScore","k2Score"];
  const COLHEADERS = ["S","K","U","N","K2"];
  const DIE1 = document.getElementById("die1");
  const DIE2 = document.getElementById("die2");
  const STATUS = document.getElementById("statusData");
  let currentCol = 0;
  let rolling = false;
  
  // User navigates away
  window.onbeforeunload = function (e) {
    var e = e || window.event;
    // For IE and Firefox
    if (e) {
      e.returnValue = 'Are You Sure? Current scores will be lost.';
    }
    // For Safari
    return 'Are You Sure? Current scores will be lost.';
  };

  // Click outside the instructions window
  window.onclick = function(event) {
    if (event.target == document.getElementById("instructions")) {
      document.getElementById("instructions").style.display = "none";
    }
  }

  // Event Listeners
  document.getElementById("insBtn").addEventListener("click", () =>  
    document.getElementById("instructions").style.display = "block");
  document.getElementById("close").addEventListener("click", () =>  
    document.getElementById("instructions").style.display = "none");
  
  document.getElementById("die1").addEventListener("click", roll);
  document.getElementById("die2").addEventListener("click", roll);
  COLHEADERS.forEach((value, index) => 
    document.getElementById(value).addEventListener("dblclick", nextColumn.bind(null,index)));

  document.getElementById(COLHEADERS[0]).style.backgroundColor = "LIGHTPINK";

  // The user clicked a die - do a roll
  function roll() {
    if (rolling) return;
    if (currentCol > 4) restart();

    rolling = true;
    STATUS.innerText = "";
    let intervalID = null;
    let frameNumber = 0;
    let stopFrame = Math.floor(Math.random() * (26) + 15);
    let dir1 = (Math.round(Math.random()) == 0) ? 1 : -1;
    let dir2 = (Math.round(Math.random()) == 0) ? 1 : -1;

    clearInterval(intervalID);
    
    intervalID = setInterval(frame, 80);
    function frame() {
      if (frameNumber == stopFrame) {
        clearInterval(intervalID);
        // Select the final number
        finishRoll();
      } else {
        showDie(DIE1, d6(), frameNumber * 35 * dir1);
        showDie(DIE2, d6(), frameNumber * 30 * dir2);
      }
      frameNumber++;
    }
  }

  // There's probably a better way to do this but whatever
  function finishRoll() {
    let firstRoll = ((document.getElementById(COLS[currentCol]).innerText.length == 0) &&
      (!document.getElementById("firstRoll").checked));

    let d1 = d6(firstRoll);
    let d2 = d6(firstRoll);
    let sum = d1 + d2;

    showDie(DIE1, d1);
    showDie(DIE2, d2);
    rolling = false;
    
    // Now for the 1's, Snake Eyes, and math...
    if (sum == 2) {  // Snake eyes
      STATUS.innerText = "SNAKE EYES!";
      document.getElementById(COLS[currentCol]).innerHTML += "🐍";
      nextColumn();
    } else if ((d1 == 1) || (d2 == 1)) {  // A single 1
      STATUS.innerText = "ONE";
      nextColumn();
    } else {  // A good number
      STATUS.innerText = sum;
      document.getElementById(COLS[currentCol]).innerHTML += sum + "<br>"; 
    }
  }

  /************ Utility functions ************/
  function showDie(die, value, angle=0) {
    die.src = IMAGES[value];
    die.style.transform = `rotate(${angle}deg)`;
  }

  function d6(ignore1 = false) {
    let low = ignore1 ? 2 : 1;
    return randInt(low, 6);
  }

  function randInt(low, high) {
    low = Math.ceil(low);
    high = Math.floor(high);
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

  function restart() {
    document.getElementById("footer").innerHTML = "Click the dice to roll<br>Double-click a column to change letters.";
    currentCol = 0;
    COLHEADERS.map(x => document.getElementById(x).style.backgroundColor = "");
    COLS.map(x => document.getElementById(x).innerHTML = "");

    document.getElementById(COLHEADERS[0]).style.backgroundColor = "LIGHTPINK";
  }

  function nextColumn(col = -1) {

    if (currentCol > 4) return;

    // Update the highlighting / column #
    document.getElementById(COLHEADERS[currentCol]).style.backgroundColor = "";
    currentCol = (col == -1) ? currentCol + 1 : col;

    // Did we go past the final column?
    if (currentCol > 4) {
      //alert("Game over, man!");
      STATUS.innerText += "\nGAME OVER";
      document.getElementById(COLS[4]).innerText += "🦨"; // 🦨
      document.getElementById("footer").innerText = "GAME OVER!!  Click the dice to play again!";
    } else {
      document.getElementById(COLHEADERS[currentCol]).style.backgroundColor = "LIGHTPINK";
    }
  }
})();