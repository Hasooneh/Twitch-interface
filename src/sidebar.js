import {otherChannels} from "./mainsection.js";
let sidebarContent = {
  sidebar: document.querySelector(".sidebar"),
  streamInfo: document.querySelector(".stream-info-wrapper"),
  onlineChannels: document.querySelectorAll(".aside-item.online"),
  collapsableElements: document.querySelectorAll(".collapsable"),
  heartIcon: document.querySelector(".heart-icon-wrapper"),
  recommendedIcon: document.querySelector(".recommended-chn-icon"),
  collapseBtn: document.querySelector(".collapse-icon"),
  collapsed: false,
  btnClicked: function(e) {

      if (sidebarContent.collapsed == false) {
        sidebarContent.sidebar.classList.add("small");
        sidebarContent.streamInfo.classList.remove("big");
        sidebarContent.collapsableElements.forEach(el => el.classList.add("hidden"));
        sidebarContent.heartIcon.classList.remove("hidden");
        sidebarContent.recommendedIcon.classList.remove("hidden");
        this.name = "play-skip-forward-outline";
        sidebarContent.collapsed = true;
      } else {
        sidebarContent.sidebar.classList.remove("small");
        sidebarContent.streamInfo.classList.add("big");
        sidebarContent.collapsableElements.forEach(el => el.classList.remove("hidden"));
        sidebarContent.heartIcon.classList.add("hidden");
        sidebarContent.recommendedIcon.classList.add("hidden");
        this.name = "play-skip-back-outline";
        sidebarContent.collapsed = false;
      }
      otherChannels.gridContainers.forEach(container => {
        otherChannels.calcHowManyChnFit(container);
      })
      otherChannels.calcHowManyChnFit(otherChannels.smallGridContainer);
  },
  showInfo: function(e) {
    let itemPosition = this.getBoundingClientRect();
    let name = this.querySelector(".streamer-name").innerText;
    let moreInfo = document.querySelector(`.stream-info-${name}`);
    moreInfo.classList.remove("hidden");
    if (sidebarContent.streamInfo.classList.contains("big")) {
      moreInfo.style.top = `${itemPosition.top + 5}px`;
    } else {
      moreInfo.style.top = `${itemPosition.top - 5}px`;
    }
    moreInfo.style.left = `${itemPosition.width + 5}px`;
    moreInfo.classList.remove("hidden");
  },
  hideInfo: function() {
    let name = this.querySelector(".streamer-name").innerText;
    let moreInfo = document.querySelector(`.stream-info-${name}`);
    moreInfo.classList.add("hidden");
  },
}
let followingChns = {
  hiddenChannels: document.querySelectorAll(".following-section .aside-item.hidden"),
  hiddenChannelsRevealed:0,
  showMoreBtn: document.querySelector(".show-more-follower-btn"),
  showLessBtn: document.querySelector(".show-less-follower-btn"),
  showMoreChannels: function() {
    if (followingChns.showLessBtn.classList.contains("hidden")) {
        followingChns.showLessBtn.classList.remove("hidden");
    }
    let hiddenChannelsLength = followingChns.hiddenChannels.length;
    let numberOfChannelsRevealed = followingChns.hiddenChannelsRevealed;

    if (hiddenChannelsLength - numberOfChannelsRevealed > 0 && hiddenChannelsLength - numberOfChannelsRevealed >  Math.floor(hiddenChannelsLength / 4)) {
      let numberOfChannelsToShow = Math.floor(hiddenChannelsLength / 4);
      for(let i = numberOfChannelsRevealed; i < numberOfChannelsRevealed + numberOfChannelsToShow;i++) {
        followingChns.hiddenChannels[i].classList.remove("hidden");
        followingChns.hiddenChannelsRevealed++;
      }
    } else {
      for(let i = numberOfChannelsRevealed; i < hiddenChannelsLength;i++) {
        followingChns.hiddenChannels[i].classList.remove("hidden");
        followingChns.hiddenChannelsRevealed++;
      }
      this.classList.add("hidden");
    }
  },
  showLessChannels:function() {
    if (followingChns.showMoreBtn.classList.contains("hidden")) {
    followingChns.showMoreBtn.classList.remove("hidden")
    }
    let hiddenChannelsLength = followingChns.hiddenChannels.length;
    let numberOfChannelsRevealed = followingChns.hiddenChannelsRevealed;

    if (numberOfChannelsRevealed > 0 && numberOfChannelsRevealed > Math.floor(hiddenChannelsLength / 4)) {
      let numberOfChannelsToHide = Math.floor(hiddenChannelsLength / 4);
      for(let i = numberOfChannelsRevealed - 1; i > (numberOfChannelsRevealed - numberOfChannelsToHide) -1;i--) {
        followingChns.hiddenChannels[i].classList.add("hidden");
        followingChns.hiddenChannelsRevealed--;
      }
    } else {
      for(let i = numberOfChannelsRevealed - 1; i > -1;i--) {
        followingChns.hiddenChannels[i].classList.add("hidden");
        followingChns.hiddenChannelsRevealed--;
        this.classList.add("hidden");
      }
    }
  },
}
let recommendedChns = {
  hiddenChannels: document.querySelectorAll(".recommended-section .aside-item.hidden"),
  showMoreBtn: document.querySelector(".show-more-recommended-btn"),
  showMoreChannels: function() {
    recommendedChns.hiddenChannels.forEach(cur => cur.classList.remove("hidden"));
    this.classList.add("hidden");
    this.removeEventListener("click",recommendedChns.showMoreChannels)
  }
}
sidebarContent.collapseBtn.addEventListener("click",sidebarContent.btnClicked);
sidebarContent.onlineChannels.forEach(chn => {
  chn.addEventListener("mouseenter",sidebarContent.showInfo)
  chn.addEventListener("mouseleave",sidebarContent.hideInfo)
})
followingChns.showMoreBtn.addEventListener("click",followingChns.showMoreChannels);
followingChns.showLessBtn.addEventListener("click",followingChns.showLessChannels);
recommendedChns.showMoreBtn.addEventListener("click", recommendedChns.showMoreChannels);
