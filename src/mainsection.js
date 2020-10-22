import {channels} from "./channels.js"
import {dropdownWhispers} from "./nav.js"
let advertisedChannelsSection = {
  channels: document.querySelectorAll(".advertised-channel"),
  buttons: document.querySelectorAll(".advertised-chn-btn"),
  rearrangeChns: function(e) {
    if(e.target.classList.contains("advertised-chn-btn-left")) {
      advertisedChannelsSection.channels.forEach(chn => {
          let channelOrder = parseInt(chn.classList[4].split("-")[1]);
          channelOrder ++;

          if(channelOrder == 5) {
            channelOrder = 0;
          }
          chn.classList.remove(chn.classList[4]);
          chn.classList.add(`channel-${channelOrder}`);

          if(channelOrder == 2) {
            chn.querySelector(".advertised-chn-content-section").classList.remove("hidden");
            chn.querySelector(".live-label").classList.remove("hidden");
          }
          if(channelOrder == 3) {
            chn.querySelector(".advertised-chn-content-section").classList.add("hidden");
            chn.querySelector(".live-label").classList.add("hidden");
          }
      })
    } else {
      advertisedChannelsSection.channels.forEach(chn => {
          let channelOrder = parseInt(chn.classList[4].split("-")[1]);
          channelOrder --;
          if (channelOrder == -1) {
            channelOrder = 4;
          }
          chn.classList.remove(chn.classList[4]);
          chn.classList.add(`channel-${channelOrder}`);

          if (channelOrder == 2) {
            chn.querySelector(".advertised-chn-content-section").classList.remove("hidden");
            chn.querySelector(".live-label").classList.remove("hidden");
          }
          if (channelOrder == 1) {
            chn.querySelector(".advertised-chn-content-section").classList.add("hidden");
            chn.querySelector(".live-label").classList.add("hidden");
          }
      })
    }
  }
}
export let otherChannels = {
  gridContainers: document.querySelectorAll(".grid-container"),
  smallGridContainer: document.querySelector(".grid-container-sm"),
  showMoreButtons: document.querySelectorAll(".show-more-btn"),
  recommendedChn: {
    channelsToShow: [],
    numberChannelsShown: 0,
    showMoreClicked: false,
  },
  recommendedCatg: {
    channelsToShow: [],
    numberChannelsShown: 0,
    showMoreClicked: false,
  },
  smallerCommunityChn: {
    channelsToShow: [],
    numberChannelsShown: 0,
    showMoreClicked: false,
  },
  hypeChn: {
    channelsToShow: [],
    numberChannelsShown: 0,
    showMoreClicked: false,
  },
  amongUsChn: {
    channelsToShow: [],
    numberChannelsShown: 0,
    showMoreClicked: false,
  },
  btnClicked: function(e) {
    this.classList.add("hidden");
    let gridContainer = this.parentElement.parentElement.querySelector(".grid-container");
    let gridContainerType = gridContainer.classList[0];
    otherChannels[gridContainerType].showMoreClicked = true;
    otherChannels.calcHowManyChnFit(gridContainer);
  },
  calcHowManyChnFit: function(gridContainer) {
    let containerWidth = gridContainer.offsetWidth;

    let channelWidth = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--channelsWidth').slice(0,4));

    let borderWidth = (Math.floor(containerWidth / channelWidth) - 1) * 10;
    containerWidth = containerWidth - borderWidth;

    let channelsThatCanFit = Math.floor(containerWidth / channelWidth);
      let containerType = gridContainer.classList[0];

      if (otherChannels[containerType].showMoreClicked == true || gridContainer.classList.contains("grid-container-sm")) {
        channelsThatCanFit *= 2;
      }
      if (channelsThatCanFit > otherChannels[containerType].numberChannelsShown) {
        for(let i= otherChannels[containerType].numberChannelsShown; i < channelsThatCanFit; i++) {
          otherChannels[containerType].channelsToShow.push(channels[containerType][i]);
          otherChannels[containerType].numberChannelsShown++;
        }
          gridContainer.innerHTML = otherChannels[containerType].channelsToShow.join("");
        } else {
          for(let i= otherChannels[containerType].numberChannelsShown; i > channelsThatCanFit; i--) {
            otherChannels[containerType].channelsToShow.pop();
            otherChannels[containerType].numberChannelsShown--;
          }
            gridContainer.innerHTML = otherChannels[containerType].channelsToShow.join("");
        }
  }
}
advertisedChannelsSection.buttons.forEach(btn => btn.addEventListener("click",advertisedChannelsSection.rearrangeChns));
window.addEventListener("load", function() {
  otherChannels.gridContainers.forEach(container => {
      otherChannels.calcHowManyChnFit(container);
  })
  otherChannels.calcHowManyChnFit(otherChannels.smallGridContainer);
});
window.addEventListener("resize", function() {
  otherChannels.gridContainers.forEach(container => {
      otherChannels.calcHowManyChnFit(container);
  })
  otherChannels.calcHowManyChnFit(otherChannels.smallGridContainer);
  dropdownWhispers.hideAndShowWhispersOpen();
});
otherChannels.showMoreButtons.forEach(btn => btn.addEventListener("click",otherChannels.btnClicked));
