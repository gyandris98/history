namespace history_backend.Domain.DTO
{
    public class SlugQuery
    {
        public int Year { get; set; }

        public int Month { get; set; }

        public int Day { get; set; }

        public string Slug { get; set; }
    }
}
