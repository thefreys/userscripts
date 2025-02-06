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
  const selectId = 'fb-vm-script-select'; // ID for the select element
  const baseUrl = 'https://www.somesite.com/?category_key='; // Base URL


  const activityCats = {
    "ACTIVESESSIONS": {"type": "TODO"},
    "ALL": {"type": "TODO"},
    "ALLAPPS": {"type": "TODO"},
    "ANONAUTHORPOSTS": {"type": "TODO"},
    "APPSANDWEBSITESOFFOFACEBOOKGROUPING": {"type": "TODO"},
    "ARCHIVEDSTORIES": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "ASSISTANTHISTORY": {"type": "TODO"},
    "BIZSUITEGUIDANCE": {"type": "TODO"},
    "BLOCKED": {"type": "TODO"},
    "CHANGECONTEXTUALPROFILE": {"type": "TODO"},
    "CHANGEPROFILECLUSTER": {"type": "TODO"},
    "CHECKINS": {"type":"1","text":"Trash","confirm":"Move to trash"},
    "COMMENTSCLUSTER": {"type":"1","text":"Remove","confirm":"Remove"},
    "COMMENTSMANAGERSEARCH": {"type": "TODO"},
    "COMMUNITYCONTRIBUTIONS": {"type": "TODO"},
    "COMMUNITYEMAILSUBSCRIPTION": {"type": "TODO"},
    "CONNECTIONSFOLLOWERSSCHEMA": {"type": "TODO"},
    "CONNECTIONSFRIENDSSCHEMA": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "CONNECTIONSGROUPING": {"type": "TODO"},
    "CONNECTIONSSUPERVISIONINFOSCHEMA": {"type": "TODO"},
    "CREATEDEVENTS": {"type": "TODO"},
    "CREATEDTOURNAMENTMATCHES": {"type": "TODO"},
    "CREATEDTOURNAMENTS": {"type": "TODO"},
    "CREATORCOLLABORATION": {"type": "TODO"},
    "CRISISRESPONSE": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "DISCOVERABLECHANNELSINVITESRECEIVED": {"type": "TODO"},
    "DISCOVERABLECHANNELSINVITESSENT": {"type": "TODO"},
    "EFFECTSSEARCH": {"type": "TODO"},
    "EVENTRSVPS": {"type": "TODO"},
    "FACEBOOKEDITORRESPONSES": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "FANTASYGAMESPICKS": {"type": "TODO"},
    "FBGROUPCHATINVITESRECEIVED": {"type": "TODO"},
    "FBGROUPCHATINVITESSENT": {"type": "TODO"},
    "FBSHORTS": {"type": "TODO"},
    "FBSHORTSDRAFT": {"type": "TODO"},
    "FBSHORTSSAVEDAUDIO": {"type": "TODO"},
    "FBSHORTSSAVEDEFFECT": {"type": "TODO"},
    "FBSHORTSSAVEDGIPHYCLIP": {"type": "TODO"},
    "FBSTORIESSAVEDSTICKER": {"type": "TODO"},
    "FOLLOWCLUSTER": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "FOLLOWEDHUBS": {"type": "TODO"},
    "FOLLOWERS": {"type": "TODO"},
    "FRIENDS": {"type": "TODO"},
    "FUNDRAISERDONATEREMINDER": {"type": "TODO"},
    "FUNDRAISERDONATION": {"type": "TODO"},
    "FUNDRAISERORGANIZERACCEPTEDREQUEST": {"type": "TODO"},
    "FUNDRAISERSINGLEMATCH": {"type": "TODO"},
    "GAMINGAPPSEARCHHISTORY": {"type": "TODO"},
    "GROUPADMINACTIONS": {"type": "TODO"},
    "GROUPADMINTOMEMBERFEEDBACK": {"type": "TODO"},
    "GROUPBADGES": {"type": "TODO"},
    "GROUPLINKEDGROUP": {"type": "TODO"},
    "GROUPMEMBERSHIP": {"type": "TODO"},
    "GROUPMEMBERWARNINGS": {"type": "TODO"},
    "GROUPMOMENTS": {"type": "TODO"},
    "GROUPPOSTS": {"type": "TODO"},
    "GROUPREACTIONS": {"type": ""},
    "GROUPSEARCH": {"type": "TODO"},
    "HIDDENEVENTS": {"type": "TODO"},
    "HIDDENSTORIES": {"type": "TODO"},
    "HISTORICALRELATIONSHIPS": {"type": "TODO"},
    "INFOSAVEDFROMFORMS": {"type": "TODO"},
    "INVITEDEVENTS": {"type": "TODO"},
    "LIKEDINTERESTS": {"type":"1","text":"Remove","confirm":"Remove"},
    "LIKEDPOSTS": {"type":"1","text":"Remove","confirm":"Remove"},
    "LIKEDPRODUCTS": {"type": "TODO"},
    "LIVEVIDEOWATCH": {"type": "TODO"},
    "LOGGEDINFORMATIONGROUPING": {"type": "TODO"},
    "LOGGEDINFORMATIONLOCATIONSCHEMA": {"type": "TODO"},
    "LOGGEDINFORMATIONPRIVACYCHECKUPSCHEMA": {"type": "TODO"},
    "LOGGEDINFORMATIONSEARCHSCHEMA": {"type": "TODO"},
    "LOGINSLOGOUTS": {"type": "TODO"},
    "MANAGEPOSTSPHOTOSANDVIDEOS": {"type":"1","text":"Trash","confirm":"Move to trash"},
    "MANAGETAGSBYOTHERSCLUSTER": {"type": "TODO"},
    "MARKETPLACEC2CRATINGS": {"type":"1","text":"Delete","confirm":"Delete"},
    "MARKETPLACEC2CSHIPPEDONBOARDING": {"type": "TODO"},
    "MARKETPLACELISTINGS": {"type": "TODO"},
    "MARKETPLACESELLERRESPONSES": {"type": "TODO"},
    "NEWSSEARCH": {"type": "TODO"},
    "OGBUILTINBOOKS": {"type": "TODO"},
    "OGBUILTINGAMES": {"type": "TODO"},
    "OGBUILTINNEWS": {"type": "TODO"},
    "OGBUILTINPRODUCTS": {"type": "TODO"},
    "OGBUILTINVIDEO": {"type": "TODO"},
    "OTHERRECORDS": {"type": "TODO"},
    "PERSONALINFOGROUPING": {"type": "TODO"},
    "PERSONALINFOPROFILEINFOSCHEMA": {"type": "TODO"},
    "PERSONALINFOSAVEDINFOSCHEMA": {"type": "TODO"},
    "POKECLUSTER": {"type": "TODO"},
    "POLLS": {"type": "TODO"},
    "POLLVOTES": {"type": "TODO"},
    "POSTSONOTHERSTIMELINES": {"type":"1","text":"Remove","confirm":"Remove"},
    "POSTSPHOTOSANDVIDEOS": {"type":"2","menu":"Action options","buttons": [{"text":"Move to trash","confirm":"Move to Trash"}]},
    "PREFERENCESGROUPING": {"type": "TODO"},
    "PRIVACYCHECKUPINTERACTION": {"type": "TODO"},
    "PRIVACYCHECKUPREMINDER": {"type": "TODO"},
    "PROFILEPUBLICCHATS": {"type": "TODO"},
    "PROFILESONGSYOUVELISTENEDTO": {"type": "TODO"},
    "RATINGSANDREVIEWS": {"type": "TODO"},
    "RECEIVEDFRIENDREQUESTS": {"type": "TODO"},
    "RECOGNIZEDDEVICES": {"type": "TODO"},
    "REMOVEDFRIENDS": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "SAVEDCOLLECTIONS": {"type": "TODO"},
    "SAVEDFORLATER": {"type": "TODO"},
    "SEARCH": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "SECURITYANDLOGININFORMATIONGROUPING": {"type": "TODO"},
    "SENTFRIENDREQUESTS": {"type": "TODO"},
    "SHOPQUESTIONS": {"type": "TODO"},
    "STORIES": {"type": "TODO"},
    "STORIESFEEDBACK": {"type": "TODO"},
    "SUPERVISIONONFACEBOOK": {"type": "TODO"},
    "SUPERVISIONONMESSENGER": {"type": "TODO"},
    "TAGGEDPHOTOS": {"type": "TODO"},
    "TRASH": {"type":"1","text":"Delete","confirm":"Delete"},
    "VIDEOPOLLSVOTED": {"type": "TODO"},
    "VIDEOSEARCH": {"type": "TODO"},
    "VIDEOWATCH": {"type": "TODO"},
    "VISUALSEARCH": {"type": "TODO"},
    "VOICESEARCH": {"type": "TODO"},
    "VOLUNTEERINGSIGNUPS": {"type": "TODO"},
    "WALLCLUSTER": {"type":"2","menu":"Action options","buttons": [{"text":"Delete","confirm":"Delete"}]},
    "WATCHVIDEOS": {"type": "TODO"},
    "YOURACTIVITYCOMMENTSANDREACTIONSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYEVENTSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYFANTASYGAMESSCHEMA": {"type": "TODO"},
    "YOURACTIVITYFBGAMINGSCHEMA": {"type": "TODO"},
    "YOURACTIVITYFBMARKETPLACESCHEMA": {"type": "TODO"},
    "YOURACTIVITYFUNDRAISERSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYGROUPING": {"type": "TODO"},
    "YOURACTIVITYGROUPSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYLIVEVIDEOSCREATED": {"type": "TODO"},
    "YOURACTIVITYLIVEVIDEOSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYMESSAGESSCHEMA": {"type": "TODO"},
    "YOURACTIVITYMETAVIEWSCHEMA": {"type": "TODO"},
    "YOURACTIVITYOTHERACTIVITYSCHEMA": {"type": "TODO"},
    "YOURACTIVITYPAGESSCHEMA": {"type": "TODO"},
    "YOURACTIVITYPOLLSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYPOSTSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYREELSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYSAVEDITEMSCOLLECTIONSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYSHOPSSCHEMA": {"type": "TODO"},
    "YOURACTIVITYSTORIESSCHEMA": {"type": "TODO"},
    "YOURACTIVITYTAGGEDINSCHEMA": {"type":"1","text":"Remove Tags","confirm":"Remove tags"},
    "YOURACTIVITYVOLUNTEERINGSCHEMA": {"type": "TODO"},
    "YOURAPPSPOSTS": {"type": "TODO"},
    "YOURPLACES": {"type": "TODO"}
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

          // Create the select element
          var select = document.createElement("select");
          select.id = selectId;

          // Add options to the select (keys from activityCats)
          for (const key in activityCats) {
              const option = document.createElement("option");
              option.value = key; // Use the key as the value
              option.text = key; // Use the key as the text
              select.appendChild(option);

              // Set the default selected value based on activityCats (if available)
              if (activityCats[key] && activityCats[key].type) {
                if (activityCats[key].type === key) { // Direct comparison since key is the value now
                  option.selected = true;
                }
              }
          }
          m.prepend(select);

          // Set default value based on URL parameter
          if (category && activityCats[category]) {  // Check key exists in activityCats
            select.value = category;
          } else {
            // If no category_key in URL and no type in activityCats, default to first key.
            const firstKey = Object.keys(activityCats)[0];
            if (firstKey) {
                select.value = firstKey;
            }
          }
          
          // Event listener for select change (no button needed)
          select.addEventListener('change', function() {
              const selectedValue = select.value;
              const currentUrl = window.location.href; // Get the current URL
              const newUrl = currentUrl.includes('?') ? // Check for existing query params
                  currentUrl.replace(/category_key=[^&]*/, `category_key=${selectedValue}`) : // Update if present
                  currentUrl + `?category_key=${selectedValue}`; // Add if not present

              window.location.href = newUrl; // Redirect to the new URL
          });

          // Keep button functionality if needed
          b.addEventListener('click', function() {
              const selectedValue = select.value;
              console.log(`Selected Activity: ${selectedValue}`);
              const currentUrl = window.location.href; // Get the current URL
              const newUrl = currentUrl.includes('?') ? // Check for existing query params
                  currentUrl.replace(/category_key=[^&]*/, `category_key=${selectedValue}`) : // Update if present
                  currentUrl + `?category_key=${selectedValue}`; // Add if not present
              window.location.href = newUrl; // Redirect to the new URL
          });

      }
    }, 100);
  }


  addTriggerButton();

})();