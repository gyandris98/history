using history_backend.Domain.DTO;
using history_backend.Domain.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace history_backend.API.Controllers
{
    [Route("api/public/tag")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ArticleService service;
        public TagController(ArticleService service)
        {
            this.service = service;
        }

        [HttpGet("{pageNumber}/{pageSize}/{tag}")]
        public async Task<ActionResult<ArticlePreviewPaginationResponse>> SearchByTag(int pageNumber, int pageSize, string tag)
        {
            Console.WriteLine("REQ");
            return Ok(await service.TagSearch(pageNumber, pageSize, tag));
        }
    }
}
