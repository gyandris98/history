using history_backend.Domain.DTO;
using history_backend.Domain.Entities;
using history_backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Slugify;
using history_backend.Domain.Entities.ArticleEntities;
using Ganss.XSS;

namespace history_backend.Domain.Services
{
    public class ArticleService
    {
        private readonly IArticleRepository articleRepository;
        private readonly IUserRepository userRepository;

        public ArticleService(IArticleRepository articleRepository, IUserRepository userRepository)
        {
            this.articleRepository = articleRepository;
            this.userRepository = userRepository;
        }

        public async Task<ClientArticle> CreateArticle(ArticleChange change, ClaimsPrincipal authUser)
        {
            var user = await userRepository.FindById(authUser.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            var scheduleTime = DateTime.Now;
            if (change.Schedule != DateTime.MinValue)
            {
                scheduleTime = change.Schedule;
            }

            var sanitizer = new HtmlSanitizer();
            change.Body.Blocks = change.Body.Blocks.Select(block =>
            {
                if (block.Data.Text != null)
                    block.Data.Text = sanitizer.Sanitize(block.Data.Text);
                if (block.Data.Caption != null)
                    block.Data.Caption = sanitizer.Sanitize(block.Data.Caption);

                return block;
            }).ToList();

            var article = new Article
            {
                Body = change.Body,
                Title = change.Title,
                Lead = change.Lead,
                User = new ArticleUser
                {
                    Id = user.ID.ToString(),
                    Name = user.Name,
                    Email = user.Email,
                },
                Cover = change.Cover,
                CreatedAt = DateTime.Now,
                Schedule = scheduleTime,
                Author = change.Author,
                Slug = new SlugHelper().GenerateSlug(change.Title),
                Tags = change.Tags,
            };

            await articleRepository.Create(article);
            return ConvertArticle(article);
        }

        public async Task<List<ArticlePreview>> GetArticlePreviews()
        {
            var articles = await articleRepository.List(10, 1);
            var previews = articles.Select(article => new ArticlePreview()
            {
                Id = article.ID.ToString(),
                Title = article.Title,
                Lead = article.Lead,
                User = article.User,
                Cover = article.Cover,
                CreatedAt = article.CreatedAt,
                Slug = article.Slug,
            }).ToList();
            return previews;
        }

        public async Task<ArticlePreviewPaginationResponse> GetArticlePreviewsPagination(int pageNumber, int pageSize)
        {
            var articles = await articleRepository.List(pageSize, pageNumber);
            var previews = articles.Select(article => ConvertArticleToPreview(article)).ToList();
            return new ArticlePreviewPaginationResponse
            {
                TotalCount = await articleRepository.GetCount(),
                PageNumber = pageNumber,
                Articles = previews,
            };
        }

        public async Task<ArticlePreviewPaginationResponse> ArticlePreviewSearch(int pageNumber, int pageSize, SearchQuery query)
        {
            (var count, var articles) = await articleRepository.Search(pageNumber, pageSize, query.Query, query.From, query.To);
            var previews = articles.Select(article => ConvertArticleToPreview(article)).ToList();
            return new ArticlePreviewPaginationResponse
            {
                TotalCount = count,
                PageNumber = pageNumber,
                Articles = previews,
            };
        }

        public async Task<ArticlePreviewPaginationResponse> TagSearch(int pageNumber, int pageSize, string tag)
        {
            (var count, var articles) = await articleRepository.SearchByTag(pageNumber, pageSize, tag);
            var previews = articles.Select(article => ConvertArticleToPreview(article)).ToList();

            return new ArticlePreviewPaginationResponse
            {
                TotalCount = count,
                PageNumber = pageNumber,
                Articles = previews,
            };
        }

        public async Task<ArticlePreviewPaginationResponse> TitleSearch(int pageNumber, int pageSize, string title) 
        {
            (var count, var articles) = await articleRepository.SearchByTitle(pageNumber, pageSize, title);
            var previews = articles.Select(article => ConvertArticleToPreview(article)).ToList();

            return new ArticlePreviewPaginationResponse
            {
                TotalCount = count,
                PageNumber = pageNumber,
                Articles = previews,
            };
        }

        public async Task<TagResponse> PartialTagSearch(string query)
        {
            (var count, var tags) = await articleRepository.SearchPartialTag(query);
            return new TagResponse
            {
                TitleCount = count,
                Tags = tags,
            };
        }

        public async Task<ClientArticle> GetById(string id)
        {
            var article = await articleRepository.GetById(id);
            if (article is null)
            {
                throw new ArgumentException($"Article with id {id} not found.");
            }

            return ConvertArticle(article);
        }

        public async Task Replace(string id, ArticleChange model)
        {
            var article = await articleRepository.GetById(id);
            if (article is null)
            {
                throw new ArgumentException($"Article with id {id} not found.");
            }

            if (article.Title != model.Title)
            {
                article.Slug = new SlugHelper().GenerateSlug(model.Title);
            }


            var sanitizer = new HtmlSanitizer();
            model.Body.Blocks = model.Body.Blocks.Select(block =>
            {
                if (block.Data.Text != null)
                    block.Data.Text = sanitizer.Sanitize(block.Data.Text);
                if (block.Data.Caption != null)
                    block.Data.Caption = sanitizer.Sanitize(block.Data.Caption);

                return block;
            }).ToList();

            article.Title = model.Title;
            article.Lead = model.Lead;
            article.Body = model.Body;
            article.Cover = model.Cover;
            article.Author = model.Author;
            article.Tags = model.Tags;
            if (model.Schedule != DateTime.MinValue)
                article.Schedule = model.Schedule;
            await articleRepository.Replace(article);
        }

        private ClientArticle ConvertArticle(Article source)
        {
            return new ClientArticle
            {
                Id = source.ID.ToString(),
                Title = source.Title,
                Lead = source.Lead,
                Body = source.Body,
                User = source.User,
                Cover = source.Cover,
                CreatedAt = source.CreatedAt,
                Slug = source.Slug,
                Author = source.Author,
                Schedule = source.Schedule,
                Tags = source.Tags,
            };
        }

        private ArticlePreview ConvertArticleToPreview(Article article)
        {
            return new ArticlePreview
            {
                Id = article.ID.ToString(),
                Title = article.Title,
                Lead = article.Lead,
                User = article.User,
                Cover = article.Cover,
                CreatedAt = article.CreatedAt,
                Slug = article.Slug,
            };
        }

        public async Task<List<ArticlePreview>> GetHomePage()
        {
            var articles = await articleRepository.List(10, 1, true);
            var result = new List<ArticlePreview>();

            foreach (var article in articles)
            {
                result.Add(new ArticlePreview
                {
                    Id = article.ID.ToString(),
                    Title = article.Title,
                    Lead = article.Lead,
                    User = article.User,
                    Cover = article.Cover,
                    CreatedAt = article.CreatedAt,
                    Slug = article.Slug,
                });
            }

            return result;
        }

        public async Task<ClientArticle> GetBySlug(SlugQuery query)
        {
            var article = await articleRepository.GetBySlug(query);
            if (article is null)
            {
                throw new ArgumentException("No article was found with these parameters.");
            }

            return ConvertArticle(article);
        }

        public async Task<List<ArticlePreview>> GetLatest(string id, int count)
        {
            var articles = await articleRepository.List(count + 1, 1, true);
            articles.RemoveAll(item => item.ID.ToString() == id);
            if (articles.Count == count + 1)
            {
                articles.RemoveAt(count);
            }

            return articles.Select(item => ConvertArticleToPreview(item)).ToList();
        }

        public async Task<List<ArticleSlug>> GetArticleSlugs(int count)
        {
            var articles = await articleRepository.List(count, 1);
            var slugs = articles.Select(article => new ArticleSlug()
            {
                Year = article.CreatedAt.Year.ToString(),
                Month = article.CreatedAt.Month.ToString(),
                Day = article.CreatedAt.Day.ToString(),
                Slug = article.Slug,
            }).ToList();

            return slugs;
        }
    }
}
