using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecretSanta.Models;

namespace SecretSanta.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SecretSantaPairsController : Controller
    {
        SecretSantaDbContext SecretSantaDB = new SecretSantaDbContext();
        [HttpGet]
        public IActionResult allPairs()
        {
            var pairs=(
                        from pair in SecretSantaDB.SecretSantaPairs
                        from giver in SecretSantaDB.Users.Where(x=>x.IdUser==pair.IdGiver).DefaultIfEmpty()
                        from receiver in SecretSantaDB.Users.Where(x => x.IdUser == pair.IdReceiver).DefaultIfEmpty()
                        select new
                        {
                            Giver=giver.FirstName+' '+giver.LastName,
                            Receiver=receiver.FirstName+' '+receiver.LastName
                        }).ToList();
            return Ok(pairs);
        }

        [HttpPost("{gID}/{rID}")]
        public IActionResult addPair(int gID, int rID)
        {
            var pair = new SecretSantaPair
            {
                IdGiver = gID,
                IdReceiver = rID
            };
            SecretSantaDB.Add(pair);
            SecretSantaDB.SaveChanges();
            return Ok(pair);
        }

        [HttpDelete]
        public IActionResult deletePairs()
        {
            List<SecretSantaPair> allPairs = SecretSantaDB.SecretSantaPairs.ToList();
            SecretSantaDB.SecretSantaPairs.RemoveRange(allPairs);
            SecretSantaDB.SaveChanges();

            return Ok("All pairs are deleted.");
        }

    }
}
