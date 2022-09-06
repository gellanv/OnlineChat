using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineChat.Models
{
    public class PrivateMessage : IMessage
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string AppUserId { get; set; }
        public string ToAppUserId { get; set; }
        public string UserName { get; set; }
        public DateTime Created { get; set; }
        public bool VisibleForAuthor { get; set; } = true;
        public Message? AnswerToMessage { get; set; }
        public AppUser AppUser { get; set; }
    }
}
