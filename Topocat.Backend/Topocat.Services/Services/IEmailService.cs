using System.Threading.Tasks;
using Topocat.Common;

namespace Topocat.Services.Services
{
    public interface IEmailService
    {
        void SendEmail(string address, string body);
    }

    [RegisterScoped(typeof(IEmailService))]
    public class EmailService : IEmailService
    {
        public void SendEmail(string address, string body)
        {
            
        }
    }
}