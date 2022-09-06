using Microsoft.AspNetCore.SignalR;

namespace OnlineChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task UpdateMessages(Object position)
        {
            await Clients.All.SendAsync("updateListMessage", position);
        }

    }
}