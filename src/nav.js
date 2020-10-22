import {channels} from "./channels.js"
let dropdownData = {
  dropdown: "",
  dropdownTogglers: document.querySelectorAll(".dropdown-fire"),
  lastDropdownSelected: "",
  dropdownCoordinates: "",
}
let dropdownBits = {
  bitsAmount: 0,
  bitsHtml: document.querySelector(".bit-count"),
  bitsBody: document.querySelector(".dropdown-bits-body"),
  updateBitsUI: function(e) {
    dropdownBits.bitsAmount += JSON.parse(e.target.dataset.bits);
    dropdownBits.bitsHtml.innerHTML = dropdownBits.bitsAmount;
  }
}
let dropdownNotif = {
  notificationDeleteIcon: document.querySelectorAll(".delete-icon-wrapper-notification"),
  changeNotificationBg: function() {
    let item = this.parentNode.parentNode;
    item.classList.contains("change-bg") ? item.classList.remove("change-bg") : item.classList.add("change-bg");
  }
}
export let dropdownWhispers = {
  searchBoxWrapper: document.querySelector(".whispers-search-wrapper"),
  searchBox: document.querySelector(".whispers-searchbox"),
  searchResultContainer: document.querySelector(".whisper-search-result"),
  searchResultArr: [],
  whispersShownContainer: document.querySelector(".whisper-items-shown"),
  whispersShown: Array.from(document.querySelectorAll(".whisper-items-shown .whisper-item")),
  usernames: Array.from(document.querySelectorAll(".whisper-item-username")),
  whispersOpenThread: document.querySelector(".whispers-open"),
  whispersOpenArr: [],
  addBorder: () => dropdownWhispers.searchBoxWrapper.classList.add("focus"),
  removeBorder: () => dropdownWhispers.searchBoxWrapper.classList.remove("focus"),
  clicked: function(e) {
    if (e.target.classList.contains("delete-icon")) {
      dropdownWhispers.deleteItem(e);
    } else {
      dropdownFunctions.closeDropdown(dropdownData.dropdown);
      dropdownWhispers.displayWhisper(e);
    }
  },
  createWhisperOpenEl: function(item) {
    let el = document.createElement("div");
    el.innerHTML = item;
    el.classList.add("whisper-open-item-wrapper");
    let highestWhisperOrderNotShrunk = Array.from(dropdownWhispers.whispersOpenThread.querySelectorAll(".whisper-open-item-wrapper:not(.child-shrinked)")).sort((a,b) => {return b.style.order - a.style.order})
    if (highestWhisperOrderNotShrunk.length > 0) {
      el.style.order = parseInt(highestWhisperOrderNotShrunk[0].style.order) + 1
    } else {
      el.style.order = 0;
    }
    return el;
  },
  shrinkWhisperOpen: function(whisperItem) {
    whisperItem.classList.add("shrink");
    whisperItem.parentElement.classList.add("child-shrinked");
    whisperItem.querySelectorAll(".collapsable").forEach(el => el.classList.add("hidden"));
  },
  unshrinkAndFocusWhisperOpen: function(username, shrunk) {
    let textBox = dropdownWhispers.whispersOpenThread.querySelector(`.whisper-open-item[data-target=${username}] input`);
    if (shrunk) {
      let whisperOpenShrunk = dropdownWhispers.whispersOpenThread.querySelector(`.whisper-open-item[data-target=${username}]`);
      whisperOpenShrunk.classList.remove("shrink");
      whisperOpenShrunk.parentElement.classList.remove("child-shrinked");
      let whisperCollapsedParts = dropdownWhispers.whispersOpenThread.querySelectorAll(`.whisper-open-item[data-target=${username}] .collapsable`);
      whisperCollapsedParts.forEach(el => el.classList.remove("hidden"));
      textBox.focus();
    } else {
      textBox.focus();
    }
  },
  incrementShrunkWhisperOrder: function() {
    let collapsedOpenWhispers = dropdownWhispers.whispersOpenThread.querySelectorAll(".shrink");
    if (collapsedOpenWhispers) {
      collapsedOpenWhispers.forEach(el => el.parentElement.style.order = parseInt(el.parentElement.style.order) + 1)
    }
  },
  decrementOrderOfWhispersOpenInfrontOf: function(whisperItem) {
    let whispersOpenContainer = Array.from(dropdownWhispers.whispersOpenThread.querySelectorAll(".whisper-open-item-wrapper"));
    let whispersOpenInfrontOfTarget = whispersOpenContainer.filter(cur => cur.style.order > whisperItem.style.order);

    whispersOpenInfrontOfTarget.forEach(el => el.style.order -= 1);
  },
  rearrangeWhisperUnShrunk: function(whisperEl) {
    let whispersOpenNotShrunk = Array.from(document.querySelectorAll(".whisper-open-item:not(.shrink)"));
    if (whispersOpenNotShrunk.length > 0) {
      whispersOpenNotShrunk = whispersOpenNotShrunk.sort((a, b) => {
        return b.parentElement.style.order - a.parentElement.style.order
      })
      whisperEl.parentElement.style.order = parseInt(whispersOpenNotShrunk[0].parentElement.style.order) + 1;
    } else {
      whisperEl.parentElement.style.order = 0;
    }
  },
  rearrangeWhisperShrunk: function(whisperItem) {
    let shrunkWhispers = document.querySelectorAll(".whisper-open-item.shrink");

    if (shrunkWhispers.length < 1) {
      let highestWhisperOrderNotShrunk = Array.from(document.querySelectorAll(".whisper-open-item:not(.shrink)")).sort((a, b) => {
        return b.parentElement.style.order - a.parentElement.style.order
      })
      whisperItem.parentElement.style.order = parseInt(highestWhisperOrderNotShrunk[0].parentElement.style.order) + 1;
    } else {
      let highestWhisperOrderShrunk = Array.from(shrunkWhispers).sort((a, b) => {
        return b.parentElement.style.order - a.parentElement.style.order
      })
      whisperItem.parentElement.style.order = parseInt(highestWhisperOrderShrunk[0].parentElement.style.order) + 1;
    }
  },
  updateWhispersOpenArr: function(target) {
    let targetIndex = dropdownWhispers.whispersOpenArr.indexOf(target);
    dropdownWhispers.whispersOpenArr.splice(targetIndex, 1)
  },
  checkIfWhisperOpenExists: function(whisperUsername) {
    let whisperTarget = dropdownWhispers.whispersOpenThread.querySelector(`.whisper-open-item[data-target=${whisperUsername}]`);
    if (whisperTarget) {
      whisperTarget.parentElement.remove();
      dropdownWhispers.updateWhispersOpenArr(whisperUsername);
      dropdownWhispers.hideAndShowWhispersOpen();
      dropdownWhispers.decrementOrderOfWhispersOpenInfrontOf(whisperTarget.parentElement);
    }
  },
  hideAndShowWhispersOpen: function() {
     let whispersOpenNotHidden = Array.from(dropdownWhispers.whispersOpenThread.querySelectorAll(".whisper-open-item-wrapper:not(.hidden)"));

     let whispersOpenHidden = Array.from(dropdownWhispers.whispersOpenThread.querySelectorAll(".whisper-open-item-wrapper.hidden"));

     let totalElementsWidth = whispersOpenNotHidden.reduce((total,el) => {
       return total + el.offsetWidth;
     },0);
     let containerWidth = dropdownWhispers.whispersOpenThread.offsetWidth;
     console.log(containerWidth, totalElementsWidth);

    if (totalElementsWidth > containerWidth) {
      let whisperWrappersShrunk = Array.from(dropdownWhispers.whispersOpenThread.querySelectorAll(".whisper-open-item-wrapper.child-shrinked"));

      let highestOrderWhisperWrapperShrunk = whisperWrappersShrunk.sort((a,b) => {
        return b.style.order - a.style.order;
      });
      let highestOrderWhisperWrapperShrunkNotHidden = highestOrderWhisperWrapperShrunk.find(el => {
        return el.classList.contains("hidden") != true
      })

      if (highestOrderWhisperWrapperShrunk.length > 0 && highestOrderWhisperWrapperShrunkNotHidden) {
        highestOrderWhisperWrapperShrunkNotHidden.classList.add("hidden");
      } else {
        Array.from(dropdownWhispers.whispersOpenThread.querySelectorAll(".whisper-open-item-wrapper:not(.child-shrinked):not(.hidden)")).sort((a,b) => {
          return b.style.order - a.style.order;
        })[1].classList.add("hidden");
      }
    } else {
        let elementsThatCanFit = Math.floor((containerWidth - totalElementsWidth) / 303);
        if (elementsThatCanFit > 0 && whispersOpenHidden.length > 0) {
          for(let i = 0; i < elementsThatCanFit; i++) {
            let lowestWhisperOpenHiddenOrder = whispersOpenHidden.sort((a,b) => {
              return a.style.order - b.style.order;
            })[i].classList.remove("hidden");
        }
      }
    }
  },
  displayWhisper: function(e) {
    let whisperItem = e.path.find(el => {
      if (el.classList == undefined) {} else if (el.classList.contains("whisper-item")) {
        return el;
      }
    });
    let whisperUsername = whisperItem.querySelector(".whisper-item-username").innerText;
    let item = channels.whispers.find(whisper => whisper.includes(whisperUsername));

    if (dropdownWhispers.whispersOpenArr.includes(whisperUsername) == false) {
      let whisperEl = dropdownWhispers.createWhisperOpenEl(item);
      dropdownWhispers.whispersOpenThread.appendChild(whisperEl);
      dropdownWhispers.hideAndShowWhispersOpen();
      dropdownWhispers.incrementShrunkWhisperOrder();
      dropdownWhispers.whispersOpenArr.includes(whisperUsername) ? "" : dropdownWhispers.whispersOpenArr.push(whisperUsername);
    } else {
      let whisperOpen = dropdownWhispers.whispersOpenThread.querySelector(`.whisper-open-item[data-target=${whisperUsername}]`);
      if (whisperOpen.classList.contains("shrink")) {
        dropdownWhispers.rearrangeWhisperUnShrunk(whisperOpen);
        dropdownWhispers.unshrinkAndFocusWhisperOpen(whisperUsername, true);
      } else {
        dropdownWhispers.unshrinkAndFocusWhisperOpen(whisperUsername, false);
      }
    }
  },
  checkTarget: function(e) {
    let whisperItemThreadHeader = e.path.find(el => {
      if (el.classList == undefined) {} else if (el.classList.contains("whispers-open-header")) {
        return el;
      }
    });

    let whisperItem = whisperItemThreadHeader ? whisperItemThreadHeader.parentElement: "";

    let whisperItemTarget = whisperItemThreadHeader ? whisperItem.dataset.target: "";

    let whisperItemWrapper = whisperItemThreadHeader ? whisperItem.parentElement: "";

    if (e.target.classList.contains("close-icon")) {
      dropdownWhispers.updateWhispersOpenArr(whisperItemTarget);
      whisperItemWrapper.remove();
      dropdownWhispers.hideAndShowWhispersOpen();
      dropdownWhispers.decrementOrderOfWhispersOpenInfrontOf(whisperItemWrapper);
    } else if (whisperItemThreadHeader) {
      if (whisperItem.classList.contains("shrink") == false) {
        dropdownWhispers.rearrangeWhisperShrunk(whisperItem);
        dropdownWhispers.shrinkWhisperOpen(whisperItem);
        dropdownWhispers.hideAndShowWhispersOpen();
      } else {
        dropdownWhispers.rearrangeWhisperUnShrunk(whisperItem);
        dropdownWhispers.unshrinkAndFocusWhisperOpen(whisperItemTarget, true);
        dropdownWhispers.hideAndShowWhispersOpen();
      }
    }
  },
  deleteItem: function(e) {
    let item = e.path.find(el => {
      if (el.classList == undefined) {} else if (el.classList.contains("whisper-item")) {
        return el;
      }
    })
    let whisperUsername = item.querySelector(".whisper-item-username").innerText;
    let elementNumber = Array.from(item.classList).find(el => el.includes("number"));
    let elToDeleteIndex = dropdownWhispers.whispersShown.findIndex(el => el.classList.contains(elementNumber));
    dropdownWhispers.updateWhispersArr(elToDeleteIndex);
    item.remove();
    dropdownWhispers.whispersShownContainer.innerHTML = dropdownWhispers.whispersShown.map(el => el.outerHTML).join("");

    dropdownWhispers.checkIfWhisperOpenExists(whisperUsername);
  },
  updateWhispersArr: function(index) {
    dropdownWhispers.whispersShown.splice(index, 1);
    dropdownWhispers.usernames.splice(index, 1);
  },
  returnSearchResults: function() {
    let searchInput = dropdownWhispers.searchBox.value;
    let reg = new RegExp(searchInput, "gi");

    let matchingTextArr = dropdownWhispers.usernames.filter(username => reg.test(username.innerText));

    dropdownWhispers.searchResultArr = matchingTextArr.map(el => el.parentElement.parentElement.outerHTML);

    searchInput == "" ?
      (dropdownWhispers.whispersShownContainer.classList.remove("hidden"),
        dropdownWhispers.searchResultContainer.classList.add("hidden")) :
      (dropdownWhispers.searchResultContainer.classList.remove("hidden"),
        dropdownWhispers.whispersShownContainer.classList.add("hidden"));

    dropdownWhispers.searchResultContainer.innerHTML = dropdownWhispers.searchResultArr.join("");
  },
}

let dropdownUser = {
  buttons: document.querySelectorAll(".circle-bg"),
  documentElementStyle: document.documentElement.style,
  onlineDot: document.querySelectorAll(".online-dot"),
  onlineStatus: document.querySelector(".online-status"),
  buttonClicked: function(e) {
    this.classList.toggle("clicked");

    if (this.classList.contains("theme")) {
      if (this.classList.contains("dark-theme") == false) {
        dropdownUser.documentElementStyle.setProperty("--dropdown", "#18181b");
        dropdownUser.documentElementStyle.setProperty("--dropdownshadow", "#000");
        dropdownUser.documentElementStyle.setProperty("--ionicon", "#d8d8d8");
        dropdownUser.documentElementStyle.setProperty("--ioniconhover", "#4f4f4f");
        dropdownUser.documentElementStyle.setProperty("--searchiconbg", "#242428");
        dropdownUser.documentElementStyle.setProperty("--bitshover", "#727272");
        dropdownUser.documentElementStyle.setProperty("--personicon", "#000");
        dropdownUser.documentElementStyle.setProperty("--main", "#0E0E10");
        dropdownUser.documentElementStyle.setProperty("--sidebarbg", "#1F1F23");
        this.classList.add("dark-theme")
      } else {
        document.documentElement.style.setProperty("--dropdown", "#fff");
        dropdownUser.documentElementStyle.setProperty("--dropdownshadow", "#e0e0e0");
        dropdownUser.documentElementStyle.setProperty("--ionicon", "#000");
        dropdownUser.documentElementStyle.setProperty("--ioniconhover", "#e0e0e0");
        dropdownUser.documentElementStyle.setProperty("--searchiconbg", "#f4f4f4");
        dropdownUser.documentElementStyle.setProperty("--bitshover", "#d3d3d3");
        dropdownUser.documentElementStyle.setProperty("--personicon", "#fff");
        dropdownUser.documentElementStyle.setProperty("--main", "#F7F7F8");
        dropdownUser.documentElementStyle.setProperty("--sidebarbg", "#EFEFF1");
        this.classList.remove("dark-theme");
      }
    } else if (this.classList.contains("online-presence")) {
      dropdownUser.onlineDot.forEach(dot => dot.classList.toggle("clicked"));
      dropdownUser.onlineStatus.innerHTML == "Offline" ? dropdownUser.onlineStatus.innerHTML = "Online" : dropdownUser.onlineStatus.innerHTML = "Offline";
    }
  },
}
let dropdownFunctions = {
  toggleDropdown: function(dropdownEl) {
    dropdownEl.classList.toggle("hidden");
  },
  closeLastOpenDropdown: function(curDropdownSelected, lastDropdownSelected) {
    if (curDropdownSelected != lastDropdownSelected && lastDropdownSelected != "") {
      dropdownFunctions.closeDropdown(lastDropdownSelected);
    }
  },
  closeDropdown: function(dropdownEl) {
    dropdownEl.classList.add("hidden");

    if (dropdownEl.classList.contains("dropdown-notifications")) {

      dropdownEl.querySelector(".body").removeEventListener("click", dropdownFunctions.deleteItem);

      dropdownNotif.notificationDeleteIcon.forEach(el => el.removeEventListener("mouseenter", dropdownNotif.changeNotificationBg));

      dropdownNotif.notificationDeleteIcon.forEach(el => el.removeEventListener("mouseleave", dropdownNotif.changeNotificationBg));
    }

    if (dropdownEl.classList.contains("dropdown-whispers")) {
      dropdownEl.querySelector(".body").removeEventListener("click", dropdownWhispers.clicked);

      dropdownWhispers.searchBox.removeEventListener("focus", dropdownWhispers.addBorder);

      dropdownWhispers.searchBox.removeEventListener("blur", dropdownWhispers.removeBorder);

      dropdownWhispers.searchBox.removeEventListener("input", dropdownWhispers.returnSearchResults);
    }
    if (dropdownEl.classList.contains("dropdown-bits")) {
      dropdownBits.bitsBody.removeEventListener("click", dropdownBits.updateBitsUI);
    }
    if (dropdownEl.classList.contains("dropdown-avatar")) {
      dropdownUser.buttons.forEach(button => button.removeEventListener("click", dropdownUser.buttonClicked));
    }
  },
  checkClickCoordinates: function(e) {
    let [dropdownR, dropdownL, dropDownT, dropDownB] = [dropdownData.dropdownCoordinates.left, dropdownData.dropdownCoordinates.right, dropdownData.dropdownCoordinates.top, dropdownData.dropdownCoordinates.bottom]
    if (e.target.classList.contains("dropdown-toggler") || ((e.pageX >= dropdownR && e.pageX <= dropdownL && e.pageY >= dropDownT && e.pageY <= dropDownB) && e.target.classList.contains("close-icon") == false)) {

    } else {
      dropdownFunctions.closeDropdown(dropdownData.dropdown);
      document.removeEventListener("click", dropdownFunctions.checkClickCoordinates);
    }
  },
  TogglerClicked: function(e) {
    dropdownData.dropdown = this.querySelector(".dropdown");

    if (e.target.classList.contains("dropdown-toggler")) {
      dropdownFunctions.toggleDropdown(dropdownData.dropdown);

      dropdownFunctions.closeLastOpenDropdown(dropdownData.dropdown, dropdownData.lastDropdownSelected);

      dropdownData.lastDropdownSelected = dropdownData.dropdown;
    }
    if (dropdownData.dropdown.classList.contains("hidden") == false) {
      dropdownData.dropdownCoordinates = dropdownData.dropdown.getBoundingClientRect();

      setTimeout(() => {
        document.addEventListener("click", dropdownFunctions.checkClickCoordinates);
      }, 100)
    }
    if (dropdownData.dropdown.classList.contains("dropdown-notifications")) {

      dropdownData.dropdown.querySelector(".body").addEventListener("click", dropdownFunctions.deleteItem);

      dropdownNotif.notificationDeleteIcon.forEach(el => el.addEventListener("mouseenter", dropdownNotif.changeNotificationBg));

      dropdownNotif.notificationDeleteIcon.forEach(el => el.addEventListener("mouseleave", dropdownNotif.changeNotificationBg));
    }
    if (dropdownData.dropdown.classList.contains("dropdown-whispers")) {
      dropdownData.dropdown.querySelector(".body").addEventListener("click", dropdownWhispers.clicked);

      dropdownWhispers.searchBox.addEventListener("focus", dropdownWhispers.addBorder);

      dropdownWhispers.searchBox.addEventListener("blur", dropdownWhispers.removeBorder);

      dropdownWhispers.searchBox.addEventListener("input", dropdownWhispers.returnSearchResults);
      dropdownWhispers.whispersOpenThread.addEventListener("click", dropdownWhispers.checkTarget);
    }
    if (dropdownData.dropdown.classList.contains("dropdown-bits")) {
      dropdownBits.bitsBody.addEventListener("click", dropdownBits.updateBitsUI);
    }
    if (dropdownData.dropdown.classList.contains("dropdown-avatar")) {
      dropdownUser.buttons.forEach(button => button.addEventListener("click", dropdownUser.buttonClicked));
    }
  },
  deleteItem: function(e) {
    if (e.target.classList.contains("delete-icon")) {
      let item = e.path.find(el => {
        if (el.classList == undefined) {

        } else if (el.classList.contains("body-item")) {
          return el;
        }
      })
      item.remove();
    }
  }
}
dropdownData.dropdownTogglers.forEach(el => el.addEventListener("click", dropdownFunctions.TogglerClicked));
