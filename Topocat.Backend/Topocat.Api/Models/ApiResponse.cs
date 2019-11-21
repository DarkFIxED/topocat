namespace Topocat.API.Models
{
    public class ApiResponse 
    {
        public static ApiResponse Success<T>(T data)
        {
            return new ApiResponse(data, null, null, true);
        }

        public static ApiResponse Success()
        {
            return new ApiResponse(null, null, null, true);
        }

        public static ApiResponse Fail<T>(string message, T error)
        {
            return new ApiResponse(null, message, error, false);
        }

        public static ApiResponse Fail(string message)
        {
            return new ApiResponse(null, message, null, false);
        }

        protected ApiResponse(object data, string message, object error, bool isSuccessful)
        {
            IsSuccessful = isSuccessful;
            Data = data;
            Error = error;
            Message = message;
        }

        public object Data { get; set; }
        public object Error { get; set; }
        public string Message { get; set; }
        public bool IsSuccessful { get; set; }
    }
}
