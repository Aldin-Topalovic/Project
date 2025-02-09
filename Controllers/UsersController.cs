using Microsoft.AspNetCore.Mvc;
using SecretSanta.Models;


namespace SecretSanta.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : Controller
    {
        SecretSantaDbContext SecretSantaDB = new SecretSantaDbContext();
        [HttpGet]
        public IActionResult allUsers()
        {
            List<User> users = SecretSantaDB.Users.OrderBy(x=>x.IdUser).ToList();
            return Ok(users);
        }

        [HttpPost]
        public IActionResult addUser([FromBody]User newUser) 
        {
            SecretSantaDB.Add(newUser);
            SecretSantaDB.SaveChanges(); 
            return Ok(newUser.IdUser);
        }

        [HttpGet("{Id:int}")]
        public IActionResult searchUser(int Id) 
        {
            User SearchedUser = SecretSantaDB.Users.Where(x => x.IdUser == Id).FirstOrDefault();
            return Ok(SearchedUser);
        }

        [HttpDelete("{Id:int}")]
        public IActionResult deleteUser(int Id)
        {
            User selectedUser= SecretSantaDB.Users.Where(x=>x.IdUser==Id).FirstOrDefault();
            if (selectedUser == null)
            {
                return NotFound($"Employee with ID ={Id} is not found.");
            }
            else 
            {
                SecretSantaDB.Remove(selectedUser);
                SecretSantaDB.SaveChanges();
            }
            return Ok("Employee has been removed.");
        }
        [HttpPost]
        public IActionResult updateUser([FromBody]User updatedUser) 
        {
            User selectedUser= SecretSantaDB.Users.Where(a => a.IdUser == updatedUser.IdUser).FirstOrDefault();
            if (selectedUser != null) 
            {
               selectedUser.FirstName = (updatedUser.FirstName !=null) ? updatedUser.FirstName :selectedUser.FirstName;
                selectedUser.LastName = (updatedUser.LastName != null) ? updatedUser.LastName : selectedUser.LastName;
                selectedUser.Email = (updatedUser.Email != null) ? updatedUser.Email : selectedUser.Email;
                selectedUser.PasswordHash = (updatedUser.PasswordHash != null) ? updatedUser.PasswordHash : selectedUser.PasswordHash;
                selectedUser.RoleId = (updatedUser.RoleId != null) ? updatedUser.RoleId : selectedUser.RoleId;
                SecretSantaDB.SaveChanges();
            }
            else { return NotFound($"Employee with ID ={updatedUser.IdUser} is not found"); }
            return Ok("Employee has been updated");
        }


    }
}
