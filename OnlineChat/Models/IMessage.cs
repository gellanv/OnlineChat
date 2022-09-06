namespace OnlineChat.Models
{
    public interface IMessage
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string UserName { get; set; }
        public DateTime Created { get; set; }
        public bool VisibleForAuthor { get; set; }
    }
}
