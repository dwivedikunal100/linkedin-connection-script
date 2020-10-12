function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function connect(profile, i) {
  try {
    const a=document.querySelector(`#${profile.id} a`);
    if(a===null){
        run();
        return;
    };
    const url = a.href;
    const connectBtn = document.querySelector(
      `#${profile.id} button[aria-label^='Connect']`
    );
    if (connectBtn === null && profiles && profiles[i + 1]) {
      connect(
        profiles[i + 1],
        i + 1
      );
      return;
    } else if (connectBtn === null) {
      run();
      return;
    }
    connectBtn.click();
    await sleep(2000);
    const addNoteBtn = document.querySelectorAll(
      "button[aria-label^='Add a note']"
    )[0];
    const h2 = document.getElementById("send-invite-modal").innerHTML;
    if (h2.trim() === "Connect") {
      const dismiss = document.querySelector("button[aria-label^='Dismiss']");
      profile.parentNode.removeChild(profile);
      dismiss.click();
      run();
      return;
    }
    if (addNoteBtn === null) {
      run();
      return;
    }
    addNoteBtn.click();
    await sleep(1000);

    const name = document
      .getElementById("send-invite-modal")
      .innerHTML.replace("Invite ", "")
      .replace(" to connect", "")
      .trim();
    const textarea = document.querySelector("#custom-message");
    textarea.value = `ADD YOUR TEXT`;

    const sendInvitationBtn = document.querySelector(
      "button[aria-label^='Done']"
    );
      sendInvitationBtn.classList.remove("artdeco-button--disabled")

      sendInvitationBtn.disabled=false;
    const http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();
    sendInvitationBtn.click();
    await sleep(2500);
    run();
    console.log('Requested + Profile Visited:', i, name, url);
  } catch (e) {
    console.error(e);
    if (profile) {
      connect(
        profile,
        i
      );
    }
  }
}

var connected = [];
var profiles = [];

async function run() {
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(250);
  profiles = document.querySelectorAll("li.search-result");
  profiles.forEach(profile => {
    const connectBtn = document.querySelector(
      `#${profile.id} button[aria-label^='Connect']`
    );
    if (connectBtn===null) {
      profile.parentNode.removeChild(profile);
    }
  });

  if (profiles.length === 0) {
    console.log("Next Page >");
    const nextPageBtn = document.querySelector("button[aria-label^='Next']");
    nextPageBtn.click();
    await sleep(3500);
    run();
  } else {
    connect(
      profiles[connected.length],
      connected.length
    );
  }
}

run();
