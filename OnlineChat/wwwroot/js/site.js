$(function () {
    $("#rooms li").click(function () {

        var sendform = document.getElementById('sendform');

        var replycontainer = document.getElementsByClassName('replycontainer');
        if (replycontainer.length != 0) {
            sendform.removeChild(replycontainer[0]);
        }        
        var quoteid = document.getElementsByName('quoteid');
        if (quoteid.length != 0) {
            sendform.removeChild(quoteid[0]);
        }

        var myid = $(this).attr("id");

        var currentRoom = document.getElementById('currentroom');
        var currentRoomform = document.getElementById('currentroomform');
        currentRoom.value = currentRoomform.value = myid;

        var currentToUser = document.getElementById('currenttouser');
        var currentToUserform = document.getElementById('currenttouserform');
        currentToUser.value = currentToUserform.value = '';

        var url = "/Home/RefreshMessageByRoom/" + myid + "?pageId=" + 1;

        $.get(url, function (data) {
            $("#main").html(data);    
            window.scrollTo(0, document.body.scrollHeight);
        });
    }); 
});

$(function () {
    $("#users li").click(function () {

        var sendform = document.getElementById('sendform');

        var replycontainer = document.getElementsByClassName('replycontainer');
        if (replycontainer.length != 0) {
            sendform.removeChild(replycontainer[0]);
        }
        var quoteid = document.getElementsByName('quoteid');
        if (quoteid.length != 0) {
            sendform.removeChild(quoteid[0]);
        }

        var myid = $(this).attr("id");

        var currentRoom = document.getElementById('currentroom');
        var currentRoomform = document.getElementById('currentroomform');
        currentRoom.value = currentRoomform.value = '';

        var currentToUser = document.getElementById('currenttouser');
        var currentToUserform = document.getElementById('currenttouserform');
        currentToUser.value = currentToUserform.value = myid;

        var url = "/Home/RefreshMessageByUser/" + myid + "?pageId=" + 1;

        $.get(url, function (data) {
            $("#main").html(data);
            window.scrollTo(0, document.body.scrollHeight);
        });
    });
});

document.addEventListener('mouseover', function (event) {
    if (event.target.className == "editmessage") {
        document.getElementById('currentmessage').value = event.target.id;
        document.getElementById('textCurrentMessage').value = event.target.getAttribute("text");
        document.getElementById('authorCurrentMessage').value = event.target.getAttribute("content");
    }
});


document.addEventListener('click', function (event) {   

    var pageId;

    if (event.target.id == "navback") {
        pageId = document.getElementById("navback").getAttribute("text");        
    }
    else if (event.target.id == "navnext") {
        pageId = document.getElementById("navnext").getAttribute("text");
    }    

    var idroom = document.getElementById('currentroom').value;
    var iduser = document.getElementById('currenttouser').value;

    var url;

    if (idroom == '') {
        var myid = iduser;
        url = "/Home/RefreshMessageByUser/" + myid + "?pageId=" + pageId;
    }
    else {
        var myid = idroom;
        url = "/Home/RefreshMessageByRoom/" + myid + "?pageId=" + pageId;
    }

    $.get(url, function (data) {
        $("#main").html(data);
        var chatHistory = document.getElementById("chat");
        window.scrollTo(0, document.body.scrollHeight);
    });
}, true);

function updateMessage() {
    var messageId = document.getElementById('currentmessage').value;
    var text = document.getElementById('textCurrentMessage').value;
    var idroom = document.getElementById('currentroom').value;
    var iduser = document.getElementById('currenttouser').value; 

    let container = document.createElement('div');
    container.className = "editcontainer";

    let title = document.createElement('h3');
    title.innerHTML = "Edit message";

    let form = document.createElement('form');
    form.setAttribute("action", "Home/UpdateMessage");
    form.setAttribute("data-ajax-success", "dellUpdateContainer");
    form.setAttribute("data-ajax", "true");
    form.setAttribute("data-ajax-method", "POST");

    let inputId = document.createElement('input'); 
    inputId.setAttribute("type", "hidden");
    inputId.setAttribute("value", messageId);
    inputId.setAttribute("name", "messageid");

    let inputRoomId = document.createElement('input');
    inputRoomId.setAttribute("type", "hidden");
    inputRoomId.setAttribute("value", idroom);
    inputRoomId.setAttribute("name", "idroom");

    let inputToUserId = document.createElement('input');
    inputToUserId.setAttribute("type", "hidden");
    inputToUserId.setAttribute("value", iduser);
    inputToUserId.setAttribute("name", "idtouser");  

    let inputText = document.createElement('textarea');
    inputText.innerText = text;
    inputText.setAttribute("name", "textmessage");    

    let buttonSub = document.createElement('button');
    buttonSub.setAttribute("type", "submit");
    buttonSub.innerHTML = "Save";
    buttonSub.className = "btn"; 


    container.appendChild(title);
    form.appendChild(inputId);
    form.appendChild(inputRoomId);
    form.appendChild(inputToUserId);
    form.appendChild(inputText);
    form.appendChild(buttonSub);
    container.appendChild(form);   
    document.body.appendChild(container);
}


function replyAllMessage() {
    var messageId = document.getElementById('currentmessage').value;
    var text = document.getElementById('textCurrentMessage').value;
    var idroom = document.getElementById('currentroom').value;

    var sendblock = document.getElementById('sendform');

    var replycontainer = document.getElementsByClassName('replycontainer');
    if (replycontainer.length == 0) {
        let quote = document.createElement('p');
        quote.className = "replycontainer";
        quote.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-return-right\" viewBox=\"0 0 16 16\">\r\n                              <path fill-rule=\"evenodd\" d=\"M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z\"/>\r\n</svg>" + text;

        sendblock.appendChild(quote);
    }
    else {
        replycontainer[0].innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-arrow-return-right\" viewBox=\"0 0 16 16\">\r\n                              <path fill-rule=\"evenodd\" d=\"M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z\"/>\r\n</svg>" + text;
    }

    var quoteid = document.getElementsByName('quoteid');
    if (quoteid.length == 0) {
        let inputId = document.createElement('input');
        inputId.setAttribute("type", "hidden");
        inputId.setAttribute("value", messageId);
        inputId.setAttribute("name", "quoteid");
        sendblock.appendChild(inputId);
    }
    else {
        quoteid[0].setAttribute("value", messageId);
    }
    window.scrollTo(0, document.body.scrollHeight);
}

function replyInPersonalChat() {

    var myid = document.getElementById('authorCurrentMessage').value;

    var currentRoom = document.getElementById('currentroom');
    var currentRoomform = document.getElementById('currentroomform');
    currentRoom.value = currentRoomform.value = '';

    var currentToUser = document.getElementById('currenttouser');
    var currentToUserform = document.getElementById('currenttouserform');
    currentToUser.value = currentToUserform.value = myid;

    var url = "/Home/RefreshMessageByUser/" + myid + "?pageId=" + 1;

    $.get(url, function (data) {
        $("#main").html(data);
        window.scrollTo(0, document.body.scrollHeight);
    });

    replyAllMessage();
}

const textInput = document.getElementById('messageText');

function clearInputField() {
    textInput.value = "";
    var sendform = document.getElementById('sendform');

    var replycontainer = document.getElementsByClassName('replycontainer');
    if (replycontainer.length != 0) {
        sendform.removeChild(replycontainer[0]);
    }
    var quoteid = document.getElementsByName('quoteid');
    if (quoteid.length != 0) {
        sendform.removeChild(quoteid[0]);
    }
    updateListMessage();
}

function dellUpdateContainer() {
    var messageText = document.getElementsByClassName('editcontainer');
    document.body.removeChild(messageText[0]);

    updateListMessage();
}

function updateListMessage() {   
    var idroom = document.getElementById('currentroom').value;
    var currentuser = document.getElementById('currentuser').value;

    updateListMessageForSelf();

    if (idroom != "") {
        updateListMessageToHub(idroom);
    }
    else {
        updateListMessageToHub(currentuser);
    }
}

function updateListMessageForSelf() {
    var idroom = document.getElementById('currentroom').value;
    var iduser = document.getElementById('currenttouser').value;

    var url;
    if (idroom == '') {
        var myid = iduser;
        url = "/Home/RefreshMessageByUser/" + myid + "?pageId=" + 1;
    }
    else {
        var myid = idroom;
        url = "/Home/RefreshMessageByRoom/" + myid + "?pageId=" + 1;
    }

    $.get(url, function (data) {
        $("#main").html(data);
        window.scrollTo(0, document.body.scrollHeight);
    });  
}


function updateListMessageInChat(position) {
    var idroom = document.getElementById('currentroom').value;
    var iduser = document.getElementById('currenttouser').value;

    var navback = document.getElementById("navback");

    var url;

    if (position == idroom || position == iduser) {
        if (navback != null) {
            var nav = navback.getAttribute("text");
            if (nav == 2) {
                var url;
                if (idroom == '') {
                    var myid = iduser;
                    url = "/Home/RefreshMessageByUser/" + myid + "?pageId=" + 1;
                }
                else {
                    var myid = idroom;
                    url = "/Home/RefreshMessageByRoom/" + myid + "?pageId=" + 1;
                }

                $.get(url, function (data) {
                    $("#main").html(data);
                    window.scrollTo(0, document.body.scrollHeight);
                });
            }
        }
        else {
            var url;
            if (idroom == '') {
                var myid = iduser;
                url = "/Home/RefreshMessageByUser/" + myid + "?pageId=" + 1;
            }
            else {
                var myid = idroom;
                url = "/Home/RefreshMessageByRoom/" + myid + "?pageId=" + 1;
            }

            $.get(url, function (data) {
                $("#main").html(data);
                window.scrollTo(0, document.body.scrollHeight);
            });
        }
    }
}