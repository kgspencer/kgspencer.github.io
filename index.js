'use strict';
(function() {
  const ALPHABETOG = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // let newAlphabet;
  let message = 'MUSICAL INSTRUMENT LIKE A PIANO OR AN ORGAN PLAYED ALONG A COASTLINE: A SEABOARD KEYBOARD.';
  let keyboardLetter = '';
  let chosenLetter = '';
  let clickedLetter;
  let numSwapped = 0;
  let totalSeconds = 0;
  let timerId;

  window.addEventListener('load', init);

  function init() {
    id('abtBtn').addEventListener('click', aboutScreen);
    id('howToBtn').addEventListener('click', howToScreen);
    id('dailyBtn').addEventListener('click', playScreen);
    qs('h1').addEventListener('click', playScreen);
    id('testBtn').addEventListener('click', testAnswer);
    id('back').addEventListener('click', playScreen);
    let keyboardBtns = qsa('#keyboard button');
    for (let i = 0; i < keyboardBtns.length; i++) {
      keyboardBtns[i].addEventListener('click', typeLetter);
      keyboardBtns[i].addEventListener('click', swapLetters);
    }
    populateMessage();
  }

  // displays results which change depending on if the user won or lost. displays their time
  // if they won; pauses the timer regardless
  function testAnswer() {
    clearInterval(timerId);

    id('selected').classList.add('hidden');
    id('keyboard').classList.add('hidden');
    id('testBtn').classList.add('hidden');
    id('results').classList.remove('hidden');
    id('back').classList.remove('hidden');
    if(isSolved()) {
      id('win').classList.remove('hidden');
      id('lose').classList.add('hidden');
    } else {
      id('lose').classList.remove('hidden');
      id('win').classList.add('hidden');
    }
  }

  function isSolved() {
    let solved = true;
    let msgBtns = qsa('#cryptoQuip button');
    for (let i = 0; i < msgBtns.length - 1; i++) { // -1 accounts for extra space button at end
      if (msgBtns[i].textContent !== message.charAt(i)) {
        solved = false;
      }
    }
    return solved;
  }

  function aboutScreen() {
    id('about').classList.remove('hidden');
    id('howTo').classList.add('hidden');
    id('daily').classList.add('hidden');
    id('back').classList.add('hidden');
  }

  function howToScreen() {
    id('about').classList.add('hidden');
    id('howTo').classList.remove('hidden');
    id('daily').classList.add('hidden');
    id('back').classList.add('hidden');
  }

  // when the user goes back to the playscreen, the timer is unpaused
  function playScreen() {
    if (!id('lose').classList.contains('hidden') && isLetterLocked()) { // if losing message is displayed rn
      timerId = setInterval(advanceTimer, 1000);
    }

    id('about').classList.add('hidden');
    id('howTo').classList.add('hidden');
    id('daily').classList.remove('hidden');
    id('keyboard').classList.remove('hidden');
    id('testBtn').classList.remove('hidden');
    id('selected').classList.remove('hidden');
    id('results').classList.add('hidden');
  }

  // Returns an array with the shuffled alphabet
  function shuffleAlphabet() {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let cardsLeft = alphabet.length;
    let rand;
    let temp;

    while (cardsLeft) {
      rand = Math.floor(Math.random() * --cardsLeft);
      temp = alphabet[cardsLeft];
      alphabet[cardsLeft] = alphabet[rand];
      alphabet[rand] = temp;
    }
    return alphabet;
  }

  // adds scrambled message to the dom
  function populateMessage() {
    let trialAlphabet = shuffleAlphabet();
    // console.log(trialAlphabet);
    let crypto = id('cryptoQuip');
    let newAlphabet = ['O', 'P', 'B', 'J', 'L', 'N', 'I', 'X', 'T', 'A', 'C', 'Y', 'D', 'S', 'G', 'R', 'K', 'V', 'W', 'U', 'Z', 'M', 'H', 'Q', 'F', 'E'];

    let words = message.split(" ");
    for (let i = 0; i < words.length; i++) {
      let word = gen('div');
      for (let j = 0; j < words[i].length; j++) {
        let currChar = words[i].charAt(j);
        let msgBtn = gen('button');

        if (/[a-zA-Z]/.test(currChar)) {
          let swap = newAlphabet[ALPHABETOG.indexOf(currChar)];
          msgBtn.textContent = swap;
          msgBtn.setAttribute('id', swap);
          msgBtn.addEventListener('mouseover', highlightLetters);
          msgBtn.addEventListener('mouseout', delightLetters);
          msgBtn.addEventListener('click', handleClick);
        } else {
          msgBtn.textContent = currChar;
          msgBtn.setAttribute('id', currChar);
          msgBtn.disabled = true; // disable any non-letter characters
        }
        word.appendChild(msgBtn);
      }
      let space = gen('button');
      space.disabled = true;
      space.id=' ';
      space.textContent = ' ';
      space.style.width = '25px';
      word.appendChild(space);
      crypto.appendChild(word)
    }
  }

  // called when a MESSAGE button is clicked. depending on the state of the event target,
  // applies various functionality
  function handleClick(evt) {
    // use classes 'selected' and 'locked' to determine what to do

    clickedLetter = evt.currentTarget;
    if (clickedLetter.classList.contains('selected')) {
      chosenLetter = '';
    } else {
      chosenLetter = clickedLetter.textContent;
    }
    id('selected').textContent = 'Selected Letter: ' + chosenLetter;

    if (keyboardLetter.length !== 0) {
      swapLetters();
    } else {
      let msgBtns = qsa('#cryptoQuip button');
      if (!clickedLetter.classList.contains('selected')) {
        for (let i = 0; i < msgBtns.length; i++) {
          msgBtns[i].removeEventListener('mouseover', highlightLetters);
          msgBtns[i].removeEventListener('mouseout', delightLetters);
          if (clickedLetter.textContent === msgBtns[i].textContent && !clickedLetter.classList.contains('locked')
          && !msgBtns[i].classList.contains('locked')) {
            msgBtns[i].classList.add('selected');
            msgBtns[i].classList.add('bright');
          } else if (clickedLetter.textContent === msgBtns[i].textContent && clickedLetter.classList.contains('locked')
          && msgBtns[i].classList.contains('locked')){
            msgBtns[i].classList.add('selected');
          } else {
            msgBtns[i].classList.remove('selected');
            msgBtns[i].classList.remove('bright');
          }
        }
      } else if (clickedLetter.classList.contains('selected')) {
        for (let i = 0; i < msgBtns.length; i++) {
          msgBtns[i].classList.remove('bright');
          msgBtns[i].classList.remove('selected');
        }
        enableMouseovers();
      } else if (isLetterSelected && !clickedLetter.classList.contains('locked')) {
        for (let i = 0; i < msgBtns.length; i++) {
          msgBtns[i].classList.remove('selected');
          msgBtns[i].classList.remove('bright');
          if (msgBtns[i].textContent === clickedLetter.textContent) {
            msgBtns[i].classList.add('selected');
            msgBtns[i].classList.add('bright');
          }
        }
      }
      swapLetters();
    }
  }

  // checks to see if any message letter is currently selected
  function isLetterSelected() {
    let msgBtns = qsa('#cryptoQuip button');
    let lettersSelected = false;
    for (let i = 0; i < msgBtns.length; i++) {
      if (msgBtns[i].classList.contains('selected')) {
        lettersSelected = true;
      }
    }
    return lettersSelected;
  }

  // checks to see if any message letter is currently locked
  function isLetterLocked() {
    let msgBtns = qsa('#cryptoQuip button');
    let lettersLocked = false;
    for (let i = 0; i < msgBtns.length; i++) {
      if (msgBtns[i].classList.contains('locked')) {
        lettersLocked = true;
      }
    }
    return lettersLocked;
  }

  // swaps the clicked message letter with the clicked keyboard letter.
  function swapLetters() {

    if ((chosenLetter.length !== 0) && (keyboardLetter.length !== 0)) {

      let msgBtns = qsa('#cryptoQuip button');
      if (!alreadySwapped()) { // ensures that a letter is not swapped twice

        // timer functionality - only starts timer when the first letter is locked
        numSwapped++;
        if (numSwapped == 1) {
          startTimer();
        }

        if (clickedLetter.classList.contains('locked')) { //if it's a locked letter,
          for (let i = 0; i < msgBtns.length; i++) {
            // only swap the locked letters
            if (msgBtns[i].textContent === chosenLetter && msgBtns[i].classList.contains('locked')) {
              msgBtns[i].textContent = keyboardLetter;
              msgBtns[i].setAttribute('id', keyboardLetter);
            }
          }
        } else {
          // only swap the unlocked letters, plus change appearance
          for (let i = 0; i < msgBtns.length; i++) {
            if (msgBtns[i].textContent === chosenLetter && !msgBtns[i].classList.contains('locked')) { // 2nd test should be unnecessary now
              msgBtns[i].classList.add('locked');
              // gameStarted = true;
              msgBtns[i].classList.remove('selected');
              msgBtns[i].classList.remove('bright');
              msgBtns[i].textContent = keyboardLetter;
              msgBtns[i].setAttribute('id', keyboardLetter);
            }
          }
        }
      } else {
        for (let i = 0; i < msgBtns.length; i++) {
          if (msgBtns[i].textContent === chosenLetter) {
            msgBtns[i].classList.remove('selected');
            msgBtns[i].classList.remove('bright');
          }
        }
        id('error').classList.remove('hidden');
        id('selected').classList.add('hidden');
        id('clue').classList.add('hidden');
        setTimeout(() => {
          id('error').classList.add('hidden');
          id('selected').classList.remove('hidden');
          id('clue').classList.remove('hidden');
        }, 2000);
        console.log('That letter has already been swapped.');
      }

      chosenLetter = '';
      keyboardLetter = '';
      id('selected').textContent = 'Selected Letter: ' + chosenLetter;
      enableMouseovers();
    }
  }

  function startTimer() {
    timerId = setInterval(advanceTimer, 1000);
  }

  function advanceTimer() {
    totalSeconds++;
    let timer = id('time');
    timer.textContent = translateTime();
  }

  function translateTime() {
    let funkyTime = "";
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    if (minutes < 10) {
      funkyTime += "0";
    }
    funkyTime += minutes + ":";
    if (seconds < 10) {
      funkyTime += "0";
    }
    funkyTime += seconds;
    return funkyTime;
  }

  // determines if a letter has already been swapped, so a letter isn't swapped more than once.
  function alreadySwapped() {
    let swapped = false;
    let msgBtns = qsa('#cryptoQuip button');
    for (let i = 0; i < msgBtns.length; i++) {
      if (msgBtns[i].textContent === keyboardLetter && msgBtns[i].classList.contains('locked')) {
        swapped = true;
      }
    }
    return swapped;
  }

  // enables mouseovers for each message button
  function enableMouseovers() {
    let msgBtns = qsa('#cryptoQuip button');

    for (let i = 0; i < msgBtns.length; i++) {
      msgBtns[i].addEventListener('mouseover', highlightLetters);
      msgBtns[i].addEventListener('mouseout', delightLetters);
    }
  }

  // highlights the letters. don't remember what the tests do
  function highlightLetters(evt) {
    let letter = evt.currentTarget;
    let msgBtns = qsa('#cryptoQuip button');
    for (let i = 0; i < msgBtns.length; i++) {
      if (letter.textContent === msgBtns[i].textContent && !msgBtns[i].classList.contains('locked') &&
      !letter.classList.contains('locked')) {
        msgBtns[i].classList.add('bright');
      }
    }
  }

  // removes the bright class from all message buttons
  function delightLetters() {
    let msgBtns = qsa('#cryptoQuip button');
    for (let i = 0; i < msgBtns.length; i++) {
      msgBtns[i].classList.remove('bright');
    }
  }

  // tiny little function. probably just put this in the event listener if you remember.
  function typeLetter(evt) {
    keyboardLetter = evt.currentTarget.textContent;
  }

  /* ********************************* HELPER FUNCTIONS ********************************* */

  /**
   * Returns an object called element from passed idName
   * @param {string} idName - string of id name
   * @returns {object} dom element with id name
   */
  function id(idName) {
    let element = document.getElementById(idName);
    return element;
  }

  function qs(selector) {
    let element = document.querySelector(selector);
    return element;
  }

  /**
   * Returns element using passed query selector
   * @param {string} querySelector - string of query selector
   * @returns {object} - dom element with query selector name
   */
  function qsa(querySelector) {
    let element = document.querySelectorAll(querySelector);
    return element;
  }

  function gen(htmlType) {
    let element = document.createElement(htmlType);
    return element;
  }
})();