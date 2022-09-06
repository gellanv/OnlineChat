$(function () {
    $("#rooms li").click(function () {

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
            var chatHistory = document.getElementById("chat");
            chatHistory.scrollTop = chatHistory.scrollHeight;
        });
    }); 
});

$(function () {
    $("#users li").click(function () {

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
            var chatHistory = document.getElementById("chat");
            chatHistory.scrollTop = chatHistory.scrollHeight;
        });
    });
});

document.addEventListener('mouseover', function (event) {
    if (event.target.className == "editmessage") {
        document.getElementById('currentmessage').value = event.target.id;
        document.getElementById('textCurrentMessage').value = event.target.getAttribute("text");
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
        chatHistory.scrollTop = chatHistory.scrollHeight;
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

const textInput = document.getElementById('messageText');

function clearInputField() {
    textInput.value = "";
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
        var chatHistory = document.getElementById("chat");
        chatHistory.scrollTop = chatHistory.scrollHeight;
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
                    var chatHistory = document.getElementById("chat");
                    chatHistory.scrollTop = chatHistory.scrollHeight;
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
                var chatHistory = document.getElementById("chat");
                chatHistory.scrollTop = chatHistory.scrollHeight;
            });
        }
    }
}