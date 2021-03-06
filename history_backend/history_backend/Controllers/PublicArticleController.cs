using history_backend.Domain.DTO;
using history_backend.Domain.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace history_backend.API.Controllers
{
    [Route("api/public/article")]
    [ApiController]
    public class PublicArticleController : ControllerBase
    {
        private readonly ArticleService articleService;

        public PublicArticleController(ArticleService articleService)
        {
            this.articleService = articleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ArticlePreview>>> HomePage()
        {
            return await articleService.GetHomePage();
        }

        [HttpGet("{id}/latest/{count}")]
        public async Task<ActionResult<List<ArticlePreview>>> GetLatest(string id, string count)
        {
            try
            {
                int number = Convert.ToInt32(count);
                return Ok(await articleService.GetLatest(id, number));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClientArticle>> Article(string id)
        {
            return await articleService.GetById(id);
        }

        [HttpGet("search/title/{pageNumber}/{pageSize}/{title}")]
        public async Task<ActionResult<ArticlePreviewPaginationResponse>> SearchByTitle(int pageNumber, int pageSize, string title)
        {
            return await articleService.TitleSearch(pageNumber, pageSize, title);
        }

        [HttpGet("slugs/{count?}")]
        public async Task<ActionResult<List<ArticleSlug>>> GetSlugs(int count = 100)
        {
            return await articleService.GetArticleSlugs(count);
        }

        [HttpGet("{year}/{month}/{day}/{slug}")]
        public async Task<ActionResult<ClientArticle>> GetArticle(string year, string month, string day, string slug)
        {
            try
            {
                return Ok(await articleService.GetBySlug(new SlugQuery
                {
                    Year = Convert.ToInt32(year),
                    Month = Convert.ToInt32(month),
                    Day = Convert.ToInt32(day),
                    Slug = slug,
                }));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
