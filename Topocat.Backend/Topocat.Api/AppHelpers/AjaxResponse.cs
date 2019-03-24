namespace Topocat.Api.AppHelpers
{
    /// <summary>
    ///     Generic object for ajax responses. Expected by handling function on frontend.
    /// </summary>
    public class AjaxResponse
    {
        public AjaxResponse(bool isSuccess, object data)
        {
            IsSuccess = isSuccess;
            Data = data;
        }

        public bool IsSuccess { get; }

        public object Data { get; }

        public static AjaxResponse Success()
        {
            return new AjaxResponse(true, null);
        }

        public static AjaxResponse Success(object data)
        {
            return new AjaxResponse(true,  data);
        }

        public static AjaxResponse Error(object data)
        {
            return new AjaxResponse(false, data);
        }
    }
}
