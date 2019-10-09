using System;

namespace Topocat.Services.Exceptions
{
    public class ServiceException : Exception
    {
        public ServiceException(object error)
        {
            Error = error;
        }

        public object Error { get; protected set; }
    }
}
