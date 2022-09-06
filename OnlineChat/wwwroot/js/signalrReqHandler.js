var connection = new signalR.HubConnectionBuilder()
    .withUrl('/Home/Index')
    .build();

connection.on('updateListMessage', updateListMessageInChat);

connection.start()
    .catch(error => {
        console.error(error.message);
    });

function updateListMessageToHub(position) {
    connection.invoke('updateMessages', position)
}