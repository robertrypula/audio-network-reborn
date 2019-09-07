// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export const mainHtml = `
  <div style="max-width: 400px; margin: 0 auto; padding: 15px; background-color: #efeef1;">
    <div>
      <input
        id="send-field"
        type="text"
        maxlength="8"
        placeholder="Type a message..."
        onkeydown="if (event.keyCode === 13) { event.preventDefault(); example.send(); }"
      />
      <button id="send-button" onclick="example.send()">Send</button>
      <div style="width: 100%; height: 5px; background-color: lightgray; position: relative; margin: 8px 0;">
        <div id="progress" style="position: absolute; top: 0; left: 0; bottom: 0; background-color: green;"></div>
      </div>
    </div>
    <div class="section">
      <button id="listen-enable-button" onclick="example.listenEnable()">Listen</button>
      <span id="waiting-for-data-frames-label" style="display: none;">Waiting for data frames...</span>
    </div>
    <div class="section">
      <div id="messages"></div>
    </div>
    <div style="margin-top: 8px; padding-top: 8px; text-align: right; border-top: 1px solid lightgray;">
      (c) Robert Rypuła 2019
    </div>
  </div>
`;
