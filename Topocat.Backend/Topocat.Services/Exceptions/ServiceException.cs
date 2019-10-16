using System;

namespace Topocat.Services.Exceptions
{
    public class ServiceException : Exception
    {
        public ServiceException(object error)
        {
            Error = error;
        }

        public ServiceException(string message, object error = null): base(message)
        {
            Error = error;
        }

        public object Error { get; protected set; }
    }
}
