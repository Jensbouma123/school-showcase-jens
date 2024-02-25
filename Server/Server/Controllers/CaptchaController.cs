using Microsoft.AspNetCore.Mvc;
using Server.Models;

namespace Server.Controllers
{
   [Route("api/[controller]")]
   public class CaptchaController : ControllerBase
   {
      // API for Captcha verification
      [HttpPost]
      [ProducesResponseType(204)]
      [ProducesResponseType(400)]
      [ProducesResponseType(500)]
      public IActionResult Post([FromBody] CaptchaModel request)
      {
         bool isCaptchaValid = HandleCaptchaVerification(request);

         if (isCaptchaValid)
            return Ok(new { success = true, Code = 200, message = "Captcha check verified." });
         else
            return BadRequest(new { success = false, Code = 401, message = "Captcha not verified" });
      }

      [ApiExplorerSettings(IgnoreApi = true)]
      public bool HandleCaptchaVerification(CaptchaModel request)
      {
         List<string> allowedTexts = new List<string>([
            "HTML",
            "CSS",
            "PHP",
            "JavaScript",
            "Laravel",
            "React",
            "Scrum",
            "C#",
            "Java",
            "Vue",
         ]);
         foreach (string text in allowedTexts)
         {
            string verify = text.ToLower();
            if (request.CaptchaCode.ToLower().Equals(verify))
            {
               return true;
            }
         }
         return false;
      }
      
   }
}