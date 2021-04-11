using history_backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class ArticleChange
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Lead { get; set; }
        [Required]
        public Body Body { get; set; }
        public Image Cover { get; set; }
        public string Author { get; set; }
        public DateTime Schedule { get; set; }
        public List<string> Tags { get; set; }
        public ArticleChange()
        {
            Tags = new List<string>();
        }
    }
}