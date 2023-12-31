/* By Jenil Soni
    27 Augest, 2023 */
onload = function () {
    console.log("here onload");
    askedWeather = false;
    askedNews = false;
    rnd2 = 'd61d4157accb44';
    newsCnt = 0;
    jokesCnt = 0;
    replyCnt = -1;
    chatEnd = false;


    userMsgSound = new Sound("media/userMsgSound.mp3");
    botMsgSound = new Sound("media/botMsgSound.mp3");

    var chatObj = {

        init: function () {
            this.cacheDom();
            this.eventBind();
            rnd3 = 'top-news?country=in&token=114059f';
        },
        cacheDom: function () {
            this.chatBox = document.getElementById("chatbox");
            this.msgBox = document.getElementById("msgbox");
            this.msgList = document.getElementById("msgList");
            this.typeBox = document.getElementById("typebox");
            this.sendBtn = document.getElementById("sendBtn");

        },

        eventBind: function () {
            sendBtn.addEventListener("click", this.addMsg);
            typeBox.addEventListener("keyup", this.addMsgEnter);
            rnd4 = 'current.json?key=c2cf5e10';
        },


        userRender: async function () {
            scrollBottom();
            if (this.newMsg.length !== 0) {
                userMsgSound.play();
                showMsg(this.newMsg, "userMsg");
                typeBox.value = "";
                setTimeout(function () {
                    chatObj.botRender();
                }, 750);
            }
            scrollBottom();
        },
        botRender: async function () {
            let totalOptions = 4;
            if (this.newMsg.toLowerCase() === "bye" || this.newMsg.toLowerCase() === "'bye'") {
                if (chatEnd === false) {
                    botMsgSound.play();
                    showMsg("Chat has ended !", "botMsg");
                    setTimeout(
                        function () {
                            showMsg("Enter 'reset' to start the chat again !", "botMsg");
                            botMsgSound.play();
                        }, 1000
                    );

                    chatEnd = true;
                }
                else {
                    botMsgSound.play();
                    showMsg("Chat has ended ! Enter 'reset' to start the chat again !", "botMsg");
                }
                return;
            }
            if (chatEnd === true) {
                if (this.newMsg.toLowerCase() === "reset" || this.newMsg.toLowerCase() === "'reset'") {
                    location.reload();
                }
                else {
                    botMsgSound.play();
                    showMsg("Chat has ended ! Enter 'reset' to start the chat again !", "botMsg");
                }
                return;
            }
            if (this.newMsg === "#" || this.newMsg === "'#'" || this.newMsg === "' # '") {
                botMsgSound.play();
                showMenu();
                return;
            }
            let optionNo = parseInt(this.newMsg);
            if (isNaN(optionNo) == false && 1 <= optionNo && optionNo <= totalOptions) {
                var data = await functionsArr[optionNo - 1]();
                replyCnt++;
            }
            else {
                data = "Please enter a valid option number (1 to 4) and try again ! :) <br> &nbsp &nbsp Or<br> Enter 'bye' if you want to end the chat.";
            }
            botMsgSound.play();
            showMsg(data, "botMsg");

            if (replyCnt === 0) {
                setTimeout(
                    function () {
                        showMsg("Great !! Keep entering option numbers to keep chatting with me. <br><br>You can enter ' # ' anytime to see the options menu again ! :) <br><br> Enter 'bye' to end the chat at any time.", "botMsg");
                        botMsgSound.play();
                    }, 1000
                );
                replyCnt = 1;
            }
        },
        addMsg: function () {
            chatObj.newMsg = typeBox.value.trim();
            chatObj.userRender();
        },

        addMsgEnter: function (e) {
            if (e.key === "Enter") {
                chatObj.newMsg = typeBox.value.trim();
                chatObj.userRender();
            }
        }

    }
    rnd1 = 'b8d7166488c'
    chatObj.init();

}
var functionsArr = [
    getNews,
    getWeather,
    getFact,
    getJoke
]
rnd6 = '40202407&q=Delhi';

var jsonObj = {

}

async function getNews() {
    if (askedNews === false) {
        console.log("news api called");
        const response = await fetch('https://gnews.io/api/v3/' + rnd3 + rnd1 + rnd2);
        const jsonResp = await response.json();
        jsonObj.newsJson = jsonResp;
        console.log("total articles= " + jsonObj.newsJson.articleCount);
        askedNews = true;
        newsCnt++;
        let artLinkStr = jsonResp.articles[0].source.url;
        return jsonResp.articles[0].title + "<br><br>Source: " + jsonResp.articles[0].source.name + "<br><a href=\"" + artLinkStr + "\" target=\"_blank\">" + "Article Link" + "</a>" + "<br><br>Enter 1 again to read another news or choose another option !";
    }
    else {

        let foo = jsonObj.newsJson;
        let ind = newsCnt % (foo.articleCount);
        console.log("ind= " + ind);
        newsCnt++;
        let artLinkStr = foo.articles[ind].source.url;
        return foo.articles[ind].title + "<br><br>Source: " + foo.articles[ind].source.name + "<br><a href=\"" + artLinkStr + "\" target=\"_blank\">" + "Article Link" + "</a>" + "<br><br>Enter 1 again to read another news or choose another option !";
    }
}

async function getWeather() {
    if (askedWeather === false) {
        console.log("weather api called");
        const response = await fetch('https://api.weatherapi.com/v1/' + rnd4 + rnd5 + rnd6);
        const jsonResp = await response.json();
        askedWeather = true;
        jsonObj.weatherJson = jsonResp;
        return "Current Temperature: " + jsonResp.current.temp_c + "\xB0C<br>Feels Like: " + jsonResp.current.feelslike_c + "\xB0C<br>Cloud Cover: " + jsonResp.current.cloud + "%<br>Humidity: " + jsonResp.current.humidity + "%" + "<br><br>Enter 2 again to get the weather update again or choose another option !";
    }
    else {
        let foo = jsonObj.weatherJson;
        return "Current Temperature: " + foo.current.temp_c + "\xB0C<br>Feels Like: " + foo.current.feelslike_c + "\xB0C<br>Cloud Cover: " + foo.current.cloud + "%<br>Humidity: " + foo.current.humidity + "%" + "<br><br>Enter 2 again to get the weather update again or choose another option !";
    }

}

async function getFact() {
    const response = await fetch('https://uselessfacts.jsph.pl//random.json?language=en');
    const jsonResp = await response.json();
    return jsonResp.text + "<br><br>Enter 3 again to read another fun fact or choose another option !";
}

async function getJoke() {
    if (jokesCnt % 10 === 9) {
        const response = await fetch('https://api.icndb.com/jokes/random');
        const jsonResp = await response.json();
        jokesCnt++;
        return jsonResp.value.joke + "<br><br>Enter 4 again to read another joke or choose another option !";
    }
    else {
        const options = {
            headers: {
                Accept: "application/json"
            }
        };
        const response = await fetch("https://icanhazdadjoke.com/", options);
        const jsonResp = await response.json();
        jokesCnt++;
        return jsonResp.joke + "<br><br>Enter 4 again to read another joke or choose another option !";
    }

}
function scrollBottom() {
    var scrollElm = document.scrollingElement;
    scrollElm.scrollTop = scrollElm.scrollHeight;
}

function showMenu() {
    let nMsg = document.createElement('li');
    nMsg.innerHTML = "Menu: <br>1.Check the news <br>2.Get weather updates <br>3.Read a fun fact <br>4.Read a joke <br><br>Enter an option number to continue or enter 'bye' to end the chat.";
    nMsg.className = "botMsg";
    msgList.appendChild(nMsg);
}
rnd5 = '2508406abcc1446';

function showMsg(data, msgClass) {
    let nMsg = document.createElement('li');
    nMsg.innerHTML = data;
    nMsg.className = msgClass;
    msgList.appendChild(nMsg);
}
class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);

        this.play = function () {
            this.sound.play();
        };
        this.stop = function () {
            this.sound.pause();
        };
    }
}