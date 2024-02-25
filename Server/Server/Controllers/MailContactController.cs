using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using MimeKit;

namespace Server.Controllers;

[Route("api/[controller]")]
public class MailContactController : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public IActionResult Post([FromBody] MailContactModel mailContact)
    {
        if (mailContact == null) return BadRequest(ModelState);
        if (!ModelState.IsValid) return BadRequest(ModelState);

        return SendMail(mailContact);
    }

    private IActionResult SendMail(MailContactModel mailContact)
    {
        MimeMessage mail = new MimeMessage();
        SmtpClient smtp = new SmtpClient();

        try
        {
            mail.From.Add(new MailboxAddress("CVJens", "no-reply@jensbouma.nl"));
            mail.To.Add(new MailboxAddress("Jens Bouma", "jensmbouma@kpnmail.nl"));

            mail.Subject = mailContact.Subject;
            var builder = new BodyBuilder()
            {
                HtmlBody = 
                    "<html>" +
                    " <style> * {font-family: sans-serif;} </style>" +
                    "   <body>" +
                    "       <p><b>Naam van:</b> " + mailContact.FirstName.ToString() + " " + mailContact.LastName.ToString() + "</p>" +
                    "       <p><b>E-mail van:</b> " + mailContact.Email.ToString() + "</p>" +
                    "       <p><b>Telefoonummer:</b> " + mailContact.PhoneNumber.ToString() + "</p>" +
                    "       <p><b>Bericht:</b> " + mailContact.Message.ToString() + "</p>" +
                    "   </body>" +
                    "</html>" 
            };
            mail.Body = builder.ToMessageBody();

            smtp.Connect("sandbox.smtp.mailtrap.io", 587, false);
            smtp.Authenticate("a4f4062df6c271", "e96ca16ca42a14");
            smtp.Send(mail);
            smtp.Disconnect(true);

            return Ok(new { State = "OK", Code = 204, Message = "Email has been delivered" });
        }
        catch (Exception e)
        {
            return StatusCode(500, new { State = "Error", Code = 500, Message = "Email has not been delivered" });
        }
        finally
        {
            smtp.Dispose();
        }
    }
}