using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using System.Web;
using Org.BouncyCastle.Bcpg.Sig;

namespace Server.Models;

public class MailContactModel
{

    [Required]
    [MinLength(1)]
    [MaxLength(60)]
    public string FirstName { get; set; }
    
    [Required]
    [MinLength(1)]
    [MaxLength(60)]
    public string LastName { get; set; }
    
    [Required]
    [Phone]
    [MinLength(1)]
    [MaxLength(20)]
    [RegularExpression(@"(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9,20}$|[0-9\\-\\s]{10,20}$)")]
    public string PhoneNumber { get; set; }
    
    [Required]
    [EmailAddress]
    [MinLength(1)]
    [MaxLength(80)]
    [RegularExpression(@"^\S+@\S+\.\S{2,}$")]
    public string Email { get; set; }
    
    [Required]
    [MinLength(1)]
    [MaxLength(200)]
    public string Subject { get; set; }
    
    [Required]
    [MinLength(1)]
    [MaxLength(600)]
    public string Message { get; set; }
    
    public void SanitizeHtml()
    {
        FirstName = SanitizeHtml(FirstName);
        LastName = SanitizeHtml(LastName);
        Subject = SanitizeHtml(Subject);
        Message = SanitizeHtml(Message);
    }

    private string SanitizeHtml(string htmlContent)
    {
        if (string.IsNullOrEmpty(htmlContent))
        {
            return htmlContent;
        }
    
        string[] safeTags = { "b", "i", "u", "strong", "em", "ul", "ol", "li", "a", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6", "p" };

        string pattern = $@"<(?!\/?(?:{string.Join("|", safeTags)})(\s|\/|$)).*?>";

        string sanitizedHtml = Regex.Replace(htmlContent, pattern, string.Empty);

        sanitizedHtml = HttpUtility.HtmlDecode(sanitizedHtml);
    
        return sanitizedHtml;
    }
    
}