using Topocat.Services.Models;

namespace Topocat.Services.Emails
{
    public interface IEmailTemplate<in TArgs> where TArgs: class
    {
        EmailMessage Build(TArgs args);
    }
}