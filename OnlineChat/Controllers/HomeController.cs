using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OnlineChat.Models;
using OnlineChat.Services;
using OnlineChat.ViewModel;
using System.Diagnostics;

namespace OnlineChat.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public readonly UserManager<AppUser> _userManager;
        public readonly ChatService _chatService;

        const int pageSize = 20;

        public ViewModelHome viewModelHome = new ViewModelHome();

        public HomeController(UserManager<AppUser> userManager, ChatService chatService)
        {
            _userManager = userManager;
            _chatService = chatService;
        }
        [Authorize]
        public async Task<IActionResult> Index(int page = 1)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            viewModelHome.UserId = currentUser.Id;
            viewModelHome.Rooms = await _chatService.GelListRoomsAsync();
            Room room = viewModelHome.Rooms.First();
            viewModelHome.Name = room.Name;
            viewModelHome.RoomId = room.Id;

            viewModelHome.Users = await _chatService.GelListUsersAsync(currentUser);
            var items = await _chatService.GetMessagesByRoomIdAsync(room.Id, currentUser);
            var count = items.Count();

            viewModelHome.Messages = items.SkipLast((page - 1) * pageSize).TakeLast(pageSize).ToList();
            PageViewModel pageViewModel = new PageViewModel(count, page, pageSize);
            viewModelHome.PageViewModel = pageViewModel;

            ViewBag.CurrentUserName = currentUser.Email;

            return View(viewModelHome);
        }

        [HttpGet]
        public async Task<ActionResult> RefreshMessageByRoom(int id, int pageId = 1)
        {
            Room room = await _chatService.GetRoomByIdAsync(id);
            viewModelHome.Name = room.Name;
            viewModelHome.RoomId = id;

            var currentUser = await _userManager.GetUserAsync(User);
            viewModelHome.UserId = currentUser.Id;
            var messages = await _chatService.GetMessagesByRoomIdAsync(id, currentUser);
            var count = messages.Count();

            viewModelHome.Messages = messages.SkipLast((pageId - 1) * pageSize).TakeLast(pageSize).ToList();
            PageViewModel pageViewModel = new PageViewModel(count, pageId, pageSize);
            viewModelHome.PageViewModel = pageViewModel;

            return PartialView("ViewMessages", viewModelHome);
        }

        [HttpGet]
        public async Task<ActionResult> RefreshMessageByUser(string id, int pageId = 1)
        {
            IdentityUser toUser = await _chatService.GetUserByIdAsync(id);

            viewModelHome.Name = toUser.UserName;
            viewModelHome.ToUserId = id;

            var currentUser = await _userManager.GetUserAsync(User);
            viewModelHome.UserId = currentUser.Id;
            var messages = await _chatService.GetMessagesByUserIdAsync(currentUser, id);
            var count = messages.Count();

            viewModelHome.Messages = messages.SkipLast((pageId - 1) * pageSize).TakeLast(pageSize).ToList();
            PageViewModel pageViewModel = new PageViewModel(count, pageId, pageSize);
            viewModelHome.PageViewModel = pageViewModel;

            return PartialView("ViewMessages", viewModelHome);
        }

        public async Task<IActionResult> CreateMessage(Message message)
        {
            var crtroom = Request.Form["currentroom"];
            var crttouser = Request.Form["currenttouser"];
            AppUser user = await _userManager.GetUserAsync(User);

            try
            {
                if (crttouser == "")
                {
                    await _chatService.CreateMessageAsync(message, user, Convert.ToInt32(crtroom));
                    return Ok();
                }
                else if (crttouser != "")
                {
                    await _chatService.CreatePrivateMessageAsync(message, user, crttouser);
                    return Ok();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return Ok(ex.ToString());
            }
        }
        public async Task<IActionResult> DellMessageForAll()
        {
            int messageId = Convert.ToInt32(Request.Form["currentmessage"]);
            var roomId = Request.Form["currentroom"];
            var userId = Request.Form["currenttouser"];

            if (roomId != "")
            {
                await _chatService.DeleteMessageForAllById(messageId);
            }
            else if (userId != "")
            {
                await _chatService.DeletePrivateMessageForAllById(messageId);
            }
            return Ok();
        }

        public async Task<IActionResult> DellMessageForAuthor()
        {
            int messageId = Convert.ToInt32(Request.Form["currentmessage"]);
            var roomId = Request.Form["currentroom"];
            var userId = Request.Form["currenttouser"];

            if (roomId != "")
            {
                await _chatService.DeleteMessageForAuthorById(messageId, userId);
            }
            else if (userId != "")
            {
                await _chatService.DeletePrivateMessageForAuthorById(messageId, userId);
            }
            return Ok();
        }

        public async Task<IActionResult> UpdateMessage()
        {
            int messageId = Convert.ToInt32(Request.Form["messageid"]);
            string messageText = Request.Form["textmessage"];
            var roomId = Request.Form["idroom"];
            var userId = Request.Form["idtouser"];

            if (roomId != "")
            {
                await _chatService.UpdateMessageById(messageId, messageText);
            }
            else if (userId != "")
            {
                await _chatService.UpdatePrivateMessageById(messageId, messageText);
            }
            return Ok();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
