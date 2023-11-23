namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string message = null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessageForStatus(statusCode);
        }

        public int StatusCode { get; set; }
    
        public string Message { get; set; }


        private string GetDefaultMessageForStatus(int statusCode)
        {
            return statusCode switch
            {
                400 => "A bad request, you have made",
                401 => "Authorized, you are not",
                404 => "Resource found, it was not",
                500 => "Errors are the path to the dark side. Error leads to anger. Anger leads to hate. Hate leads to carrier change..",
                 _  => null
            };
        }        
    }

}