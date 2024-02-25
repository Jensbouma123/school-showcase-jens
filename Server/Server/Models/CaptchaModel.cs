using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using System.Web;

namespace Server.Models;

public class CaptchaModel
{
    [Required]
    [MinLength(1)]
    [MaxLength(60)]
    public string CaptchaCode { get; set; }
    
    public void SanitizeHtml()
    {
        CaptchaCode = SanitizeHtml(CaptchaCode);
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