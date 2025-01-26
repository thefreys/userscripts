// ==UserScript==
// @name         Automate Deleting Facebook Comments and Reactions
// @namespace    http://violentmonkey.com/
// @version      1.0
// @author       djfrey
// @description  Automatically delete comments and reactions
// @match        *://*facebook.com/*/allactivity*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  var category = getQueryVal('category_key');
  const btnId = 'fb-vm-script-btn';

  //Categories where removing all items is based on checking checkboxes
  const cbCat = {
    //Comments and reactions
    "COMMENTSCLUSTER": {
      "label": "Comments",
      "text": "Remove",
      "confirm": "Remove"
    },
    "LIKEDPOSTS": {
      "label": "Likes and reactions",
      "text": "Remove",
      "confirm": "Remove"
    },
    //Posts
    "MANAGEPOSTSPHOTOSANDVIDEOS": {
      "label": "Your posts, photos and videos",
      "text": "Trash",
      "confirm": "Move to trash"
    },
    "POSTSONOTHERSTIMELINES": {
      "label": "Posts on other's timelines",
      "text": "Remove",
      "confirm": "Remove"
    },
    "YOURACTIVITYTAGGEDINSCHEMA": {
      "text": "Remove Tags",
      "confirm": "Remove tags"
    },
    "MARKETPLACEC2CRATINGS": {
      "label": "Marketplace ratings you've given",
      "text": "Delete",
      "confirm": "Delete"
    },
    "LIKEDINTERESTS": {
      "label": "Pages, page likes and interests",
      "text": "Remove",
      "confirm": "Remove"
    },
    "TRASH": {
      "label": "Trash",
      "text": "Delete",
      "confirm": "Delete"
    }
  };

   //Categories where removing all items is based on clicking a menu

  //https://www.facebook.com/727260453/allactivity?activity_history=false&category_key=REMOVEDFRIENDS
  const menuCat = {
    "REMOVEDFRIENDS": {
      "label": "Removed friends",
      "menu": "Action options",
      "buttons": [
        {"text": "Delete", "confirm": "Delete"}
      ]
    },
    "FOLLOWCLUSTER": {
      "label": "Who you've followed and unfollowed",
      "menu": "Action options",
      "buttons": [
        {"text": "Delete", "confirm": "Delete"}
      ]
    },
    "CRISISRESPONSE": {
      "label": "Your Crisis Response settings",
      "menu": "Action options",
      "buttons": [
        {"text": "Delete", "confirm": "Delete"}
      ]
    },
    "SEARCH": {
      "label": "Your search history",
      "menu": "Action options",
      "buttons": [
        {"text": "Delete", "confirm": "Delete"}
      ]
    },
    "POSTSPHOTOSANDVIDEOS": {
      "label": "Your posts, photos and videos",
      "menu": "Action options",
      "buttons": [
        {"text": "Move to trash", "confirm": "Move to Trash"}
      ]
    },
    "WALLCLUSTER": {
      "label": "Other people's posts to your feed",
      "menu": "Action options",
      "buttons": [
        {"text": "Delete", "confirm": "Delete"}
      ]
    },
    "FACEBOOKEDITORRESPONSES": {
      "label": "Facebook Editor",
      "menu": "Action options",
      "buttons": [
        {"text": "Delete", "confirm": "Delete"}
      ]
    }
  };

  var scriptRunning = false;

  //https://www.facebook.com/{userid}/allactivity?activity_history=false&category=COMMENTSCLUSTER&manage_mode=false&should_load_landing_page=false
  function getQueryVal(key) {
    let q = new URLSearchParams(window.location.search);
    let out = q.get(key);
    return out;
  }

  function getNode(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  function doDelete() {
    if (cbCat[category]) {
      checkDelete();
    } else if (menuCat[category]) {
      menuDelete();
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
    var params = menuCat[category];

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

    let removeButton = getNode("//span[text()='" + cbCat[category].text + "']");
    if (removeButton) {
      removeButton.click();
      await new Promise(r => setTimeout(r, 1000));
      let removeConfirm = document.querySelectorAll('[aria-label="' + cbCat[category].confirm + '"]')[1];
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