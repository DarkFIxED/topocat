namespace Topocat.API.Models
{
    public class ApiResponse 
    {
        public static ApiResponse Success<T>(T data)
        {
            return new ApiResponse(data, null, true);
        }

        public static ApiResponse Success()
        {
            return new ApiResponse(null, null, true);
        }

        public static ApiResponse Fail<T>(T error)
        {
            return new ApiResponse(null, error, false);
        }

        protected ApiResponse(object data, object error, bool isSuccessful)
        {
            IsSuccessful = isSuccessful;
            Data = data;
            Error = error;
        }

        public object Data { get; set; }
        public object Error { get; set; }
        public bool IsSuccessful { get; set; }
    }
}
