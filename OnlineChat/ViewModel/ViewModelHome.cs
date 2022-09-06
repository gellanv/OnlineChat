using Microsoft.AspNetCore.Identity;
using OnlineChat.Models;

namespace OnlineChat.ViewModel
{
    public class ViewModelHome
    {
        public IEnumerable<Room> Rooms { get; set; }
        public IEnumerable<IdentityUser> Users { get; set; }
        public IEnumerable<IMessage> Messages { get; set; }
        public PageViewModel PageViewModel { get; set; }

        public string Name { get; set; }
        public string UserId { get; set; }
        public string? ToUserId { get; set; }
        public int? RoomId { get; set; }
    }
}