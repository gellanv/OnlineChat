using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OnlineChat.Data;
using OnlineChat.Models;

namespace OnlineChat.Services
{
    public class ChatService
    {
        public readonly ApplicationDbContext _context;
        public ChatService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Room>> GelListRoomsAsync()
        {
            var roomList = await _context.Rooms.Include(m => m.Messages).ToListAsync();
            return roomList;
        }
        public async Task<IdentityUser> GetUserByIdAsync(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

            return user;
        }

        public async Task<Room> GetRoomByIdAsync(int id)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(x => x.Id == id);

            return room;
        }

        public async Task<Message> GetMessageByIdAsync(int id)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(x => x.Id == id);

            return message;
        }

        public async Task<PrivateMessage> GetPrivateMessageByIdAsync(int id)
        {
            var privateMessage = await _context.PrivateMessages.FirstOrDefaultAsync(x => x.Id == id);

            return privateMessage;
        }

        public async Task<IEnumerable<IdentityUser>> GelListUsersAsync(AppUser currentUser)
        {
            var userList = new List<IdentityUser>();

            if (currentUser != null)
            {
                userList = await _context.Users.Where(x => x.Id != currentUser.Id).ToListAsync();
            }
            else
            {
                userList = await _context.Users.ToListAsync();
            }
            return userList;
        }

        public async Task<IEnumerable<Message>> GetMessagesByRoomIdAsync(int idRoom, AppUser currentUser)
        {
            var messages = await _context.Messages
                                                .Where(x => x.RoomId == idRoom)
                                                .Where(x => x.VisibleForAuthor == true || (x.VisibleForAuthor == false && x.AppUserId != currentUser.Id))
                                                .OrderBy(x => x.Created)
                                                .ToListAsync();
            return messages;
        }

        public async Task<IEnumerable<PrivateMessage>> GetMessagesByUserIdAsync(AppUser currentUser, string idToUser)
        {
            var messages = await _context.PrivateMessages.Include(x => x.AnswerToMessage)
                             .Where(x => x.AppUserId == currentUser.Id && x.ToAppUserId == idToUser || (x.AppUserId == idToUser && x.ToAppUserId == currentUser.Id))
                             .Where(x => x.VisibleForAuthor == true || (x.VisibleForAuthor == false && x.AppUserId != currentUser.Id))
                             .OrderBy(x => x.Created)
                             .ToListAsync();
            return messages;

        }

        public async Task CreateMessageAsync(Message message, AppUser currentUser, int roomId, int? quoterId = null)
        {
            DateTime dateTime = DateTime.Now;

            message.AppUserId = currentUser.Id;
            message.UserName = currentUser.UserName;
            message.Created = dateTime;
            message.RoomId = roomId;

            if (quoterId != null)
            {
                Message quoteMessage = await GetMessageByIdAsync((int)quoterId);
                message.AnswerToMessage = quoteMessage;
            }

            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        public async Task CreatePrivateMessageAsync(Message message, AppUser currentUser, string userId, int? quoterId = null)
        {
            DateTime dateTime = DateTime.Now;

            PrivateMessage privateMessage = new PrivateMessage();
            privateMessage.Text = message.Text;
            privateMessage.UserName = message.UserName;
            privateMessage.Created = dateTime;
            privateMessage.AppUserId = currentUser.Id;
            privateMessage.ToAppUserId = userId;

            if (quoterId != null)
            {
                Message quoteMessage = await GetMessageByIdAsync((int)quoterId);
                privateMessage.AnswerToMessage = quoteMessage;
            }

            await _context.PrivateMessages.AddAsync(privateMessage);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteMessageForAllById(int id)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(x => x.Id == id);

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

        }

        public async Task DeletePrivateMessageForAllById(int id)
        {
            var message = await _context.PrivateMessages.FirstOrDefaultAsync(x => x.Id == id);

            _context.PrivateMessages.Remove(message);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteMessageForAuthorById(int id, string userId)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(x => x.Id == id);
            message.VisibleForAuthor = false;

            _context.Update(message);
            await _context.SaveChangesAsync();

        }

        public async Task DeletePrivateMessageForAuthorById(int id, string userId)
        {
            var message = await _context.PrivateMessages.FirstOrDefaultAsync(x => x.Id == id);
            message.VisibleForAuthor = false;

            _context.Update(message);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateMessageById(int id, string messageText)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(x => x.Id == id);
            message.Text = messageText;

            _context.Update(message);
            await _context.SaveChangesAsync();

        }

        public async Task UpdatePrivateMessageById(int id, string messageText)
        {
            var message = await _context.PrivateMessages.FirstOrDefaultAsync(x => x.Id == id);
            message.Text = messageText;

            _context.Update(message);
            await _context.SaveChangesAsync();
        }
    }
}
