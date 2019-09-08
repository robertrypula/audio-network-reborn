// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export const mainHtml = `
  <div class="data-link-layer-chat">
    <h2>Audio Network Lite</h2>
    <div>
      <input id="send-field" maxlength="8" placeholder="Type a message..." type="text" />
      <button id="send-button" type="button">Send</button>
      <div class="progress-bar-wrapper"><div id="progress-bar"></div></div>
    </div>
    <div class="section">
      <button id="listen-enable-button" type="button">Listen</button>
      <span id="waiting-for-data-frames-label" style="display: none;">Waiting for data frames...</span>
    </div>
    <div class="section">
      <div id="messages"></div>
    </div>
    <div class="credits">(c) Robert Rypuła 2019</div>
  </div>
`;
