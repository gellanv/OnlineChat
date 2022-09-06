using Microsoft.AspNetCore.Identity;

namespace OnlineChat.Models
{
    public class AppUser : IdentityUser
    {
        public List<Message> Messages { get; set; }
        public List<PrivateMessage> PrivateMessages { get; set; }
    }
}
