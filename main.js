{
  let video = document.querySelector("video");
  video && (
    chrome.runtime.sendMessage(0),
    onkeydown = ({ key }) => {
      let t = key == "." ? .016666666666666666 : key == "," && -.016666666666666666;
      t && (video.paused || video.pause(), video.currentTime += t);
    }
  )
}