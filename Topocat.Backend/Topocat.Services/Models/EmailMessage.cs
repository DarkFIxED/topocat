namespace Topocat.Services.Models
{
    public class EmailMessage
    {
        public string[] Addresses { get; set; }

        public string Body { get; set; }

        public string Subject { get; set; }
    }
}