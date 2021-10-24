namespace history_backend.Domain.DTO
{
    public class AuthenticateResponse
    {
        public string AccessToken { get; set; }

        public RefreshToken RefreshToken { get; set; }
    }
}
