// ==UserScript==
// @name         Automate Deleting Facebook Activity
// @namespace    http://violentmonkey.com/
// @version      1.0
// @author       djfreys
// @description  Automatically delete comments and reactions
// @match        *://*facebook.com/*/allactivity*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  var category = getQueryVal('category_key');
  console.log('violentmonkey: '+category);
  const btnId = 'fb-vm-script-btn';

  const activityCats = {
    "COMMENTSCLUSTER": {"type":"1","text":"Remove","confirm":"Remove"},
    "CRISISRESPONSE": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "FACEBOOKEDITORRESPONSES": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "FOLLOWCLUSTER": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "LIKEDINTERESTS": {"type":"1","text":"Remove","confirm":"Remove"},
    "LIKEDPOSTS": {"type":"1","text":"Remove","confirm":"Remove"},
    "MANAGEPOSTSPHOTOSANDVIDEOS": {"type":"1","text":"Trash","confirm":"Move to trash"},
    "MARKETPLACEC2CRATINGS": {"type":"1","text":"Delete","confirm":"Delete"},
    "POSTSONOTHERSTIMELINES": {"type":"1","text":"Remove","confirm":"Remove"},
    "POSTSPHOTOSANDVIDEOS": {"type":"2","menu":"Action options","buttons": [{"text":"Move to trash","confirm":"Move to Trash"}]},
    "REMOVEDFRIENDS": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "SEARCH": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "TRASH": {"type":"1","text":"Delete","confirm":"Delete"},
    "WALLCLUSTER": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "YOURACTIVITYTAGGEDINSCHEMA": {"type":"1","text":"Remove Tags","confirm":"Remove tags"}
  };

  var scriptRunning = false;

  function getQueryVal(key) {
    let q = new URLSearchParams(window.location.search);
    let out = q.get(key);
    return out;
  }

  function getNode(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  function doDelete() {
    if (activityCats[category]) {
      if (activityCats[category].type == "1") {
        checkDelete();
      }
      else if (activityCats[category].type == "2") {
        menuDelete();
      }
      else {
        alert("Category " + category + " has unhandled type " + activityCats[category].type);
      }
    } else {
      if (category) {
        alert("Couldn't find a way to delete " + category);
      } else {
        alert("Must be in an Activity Log category");
      }
    }
  }

  async function menuDelete() {
    var rcount = 0;
    var err = 0;
    var params = activityCats[category];
    var menus = document.querySelectorAll('div[aria-label="' + params.menu + '"]');

    while (true) {
      if (document.evaluate("//span[text()='Nothing to show']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
        alert("All items removed");
        break;
      }

      var menus = document.querySelectorAll('div[aria-label="' + params.menu + '"]');
      rcount = menus.length - err;
      if (rcount > 0) {

        var menu = menus[err]; //If there's been errors, skip that many items

        if (!menu) {
          alert('No menu found');
          break;
        }

        menu.click();
        await new Promise(r => setTimeout(r, 500));

        //There can be more than one way to delete an item
        var delButtons = [];
        for (let i = 0; i < params.buttons.length; i++) {
          let b = document.evaluate("//span[text()='"+params.buttons[i].text+"']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (b) { //If the button exists, keep track of it and its corresponding confirm text, we can't test for the confirm button until it exists
            let b1 = {
              "del": b,
              "confirm": params.buttons[i].confirm
            };
            delButtons.push(b1);
          }
        }

        if (delButtons.length > 0) {
          for (let i = 0; i < delButtons.length; i++) {
            delButtons[i].del.click();
            await new Promise(r => setTimeout(r, 1000));

            var ePath  = "//span[text()='Something went wrong. Please try again.']";
            var errSpan = document.evaluate(ePath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (errSpan) {
              err = err + 1;
              var bClose = errSpan.parentElement.parentElement.parentElement.querySelector('div[aria-label="Close"]');
              bClose.click();
              await new Promise(r => setTimeout(r, 1000));
            } else {
              document.querySelectorAll('[aria-label="' + delButtons[i].confirm + '"][role="button"]')[0].click();
              await new Promise(r => setTimeout(r, 2000));
            }

          }
        }
      }
    }
  }

  //"checkbox"-type delete
  async function checkDelete() {

    /*let b = document.getElementById(btnId);

    if (scriptRunning) {
      b.textContent = cat[category].btn.stop;
      scriptRunning = false;
      return;
    } else {
      b.textContent = cat[category].btn.start;
      scriptRunning = true;
    }*/

    let checkAll = document.querySelectorAll('input[type="checkbox"]')[0]; //The "All" checkbox should be the first checkbox on the page

    if (!checkAll) {
      alert('Could not find "All" checkbox');
      return;
    }

    let isChecked = checkAll.getAttribute('aria-checked');
    if (isChecked == "false") {
      checkAll.click();
      await new Promise(r => setTimeout(r, 500));
    }

    let removeButton = getNode("//span[text()='" + activityCats[category].text + "']");
    if (removeButton) {
      removeButton.click();
      await new Promise(r => setTimeout(r, 1000));
      let removeConfirm = document.querySelectorAll('[aria-label="' + activityCats[category].confirm + '"]')[1];
      if (removeConfirm) {
        removeConfirm.click();
      }
      //Pause for a second, the delete will begin, and the background position of the checkbox will change...
      await new Promise(r => setTimeout(r, 1000));
      var interval = setInterval(function() {
        //This is a visual identification of the All checkbox state
        //We can tell what's going on by the background image position
        let i = document.querySelectorAll('i[data-visualcompletion="css-img"]')[0];
        let pos = i.style.backgroundPositionY;
        if (pos == "-125px") { //The delete is done!
          clearInterval(interval);
        }
      }, 1000);
    }

    var c = 10;

    var intAll = setInterval(function() {
      if (document.querySelectorAll('[aria-label="Action options"]').length) {
        c = 10;
        clearInterval(intAll);
        checkDelete();
      } else {
        c--;
        if (c === 0) {
          clearInterval(intAll);
          alert("All items have been removed");
          return;
        }
      }
    }, 750);
  }

  function addTriggerButton() {
    var interval = setInterval(function() {
      var m = document.querySelector('div[aria-label="Account Controls and Settings"]');
      if (m) {
          clearInterval(interval);
          var b = document.createElement("button");
          b.id = btnId;
          //b.textContent = cat[category].btn.start;
          b.textContent = "Start";
          b.style.zIndex = '9999';
          b.style.fontSize = "1.2rem";
          b.style.margin = "0px 10px";
          b.addEventListener('click', doDelete);
          m.prepend(b);
      }
    }, 100);
  }


  addTriggerButton();

})();