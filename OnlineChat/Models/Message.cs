namespace OnlineChat.Models
{
    public class Message : IMessage
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string Text { get; set; }
        public string UserName { get; set; }
        public DateTime Created { get; set; }
        public bool VisibleForAuthor { get; set; } = true;

        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Room Room { get; set; }
    }
}