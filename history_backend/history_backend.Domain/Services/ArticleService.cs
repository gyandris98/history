using history_backend.Domain.DTO;
using history_backend.Domain.Entities;
using history_backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Slugify;

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
                throw new Exception();
            Console.WriteLine("User found");
            var scheduleTime = DateTime.Now;
            if (change.Schedule != null)
            {
                scheduleTime = change.Schedule;
            }
            var article = new Article
            {
                Body = change.Body,
                Title = change.Title,
                Lead = change.Lead,
                User = new ArticleUser
                {
                    Id = user.ID.ToString(),
                    Name = user.Name,
                    Email = user.Email
                },
                Cover = change.Cover,
                CreatedAt = DateTime.Now,
                Schedule = scheduleTime,
                Author = change.Author,
                Slug = new SlugHelper().GenerateSlug(change.Title)
            };
            Console.WriteLine("Creating article");
            await articleRepository.Create(article);
            Console.WriteLine("Article created");
            return await ConvertArticle(article);
        }

        public async Task<List<ArticlePreview>> GetArticlePreviews()
        {
            var articles = await articleRepository.List(10, 1);
            var result = new List<ArticlePreview>();
            foreach (var article in articles)
            {
                //var user = await userRepository.FindById(article.UserId);
                result.Add(new ArticlePreview
                {
                    Id = article.ID.ToString(),
                    Title = article.Title,
                    Lead = article.Lead,
                    User = article.User,
                    Cover = article.Cover,
                    /*User = new ClientUser
                    {
                        Id = user.ID.ToString(),
                        Email = user.Email,
                        Name = user.Name
                    },*/
                    CreatedAt = article.CreatedAt,
                    Slug = article.Slug
                });
            }
            return result;
        }

        public async Task<ArticlePreviewPaginationResponse> GetArticlePreviewsPagination(int pageNumber, int pageSize)
        {
            var articles = await articleRepository.List(pageSize, pageNumber);
            var previews = articles.Select(article => ConvertArticleToPreview(article)).ToList();
            return new ArticlePreviewPaginationResponse
            {
                TotalCount = await articleRepository.GetCount(),
                PageNumber = pageNumber,
                Articles = previews
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
                Articles = previews
            };
        }

        public async Task<ClientArticle> GetById(string id)
        {
            var article = await articleRepository.GetById(id);
            if (article == null) throw new Exception();
            return await ConvertArticle(article);
        }

        public async Task Replace(string id, ArticleChange model)
        {
            var article = await articleRepository.GetById(id);
            if (article == null) throw new Exception();
            if (article.Title != model.Title)
            {
                article.Slug = new SlugHelper().GenerateSlug(model.Title);
            }
            article.Title = model.Title;
            article.Lead = model.Lead;
            article.Body = model.Body;
            article.Cover = model.Cover;
            article.Author = model.Author;
            if (model.Schedule != null)
                article.Schedule = model.Schedule;
            else
                article.Schedule = article.CreatedAt;
            await articleRepository.Replace(article);
        }

        private async Task<ClientArticle> ConvertArticle(Article source)
        {
            //var user = await userRepository.FindById(source.UserId);
           // if (user == null) throw new Exception();
            return new ClientArticle
            {
                Id = source.ID.ToString(),
                Title = source.Title,
                Lead = source.Lead,
                Body = source.Body,
                user = source.User,
                Cover = source.Cover,
                /*user = new ClientUser
                {
                    Id = user.ID.ToString(),
                    Email = user.Email,
                    Name = user.Name
                },*/
                CreatedAt = source.CreatedAt,
                Slug = source.Slug,
                Author = source.Author,
                Schedule = source.Schedule
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
                Slug = article.Slug
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
                    Slug = article.Slug
                });
            }
            return result;
        }

        public async Task<ClientArticle> GetBySlug(SlugQuery query)
        {
            var article = await articleRepository.GetBySlug(query);
            if (article == null) throw new Exception();
            return await ConvertArticle(article);
        }

        public async Task<List<ArticlePreview>> GetLatest(string id, int count)
        {
            var articles = await articleRepository.List(count + 1, 1, true);
            articles.RemoveAll(item => item.ID.ToString() == id);
            if (articles.Count == count + 1)
                articles.RemoveAt(count);
            return articles.Select(item => ConvertArticleToPreview(item)).ToList();
        }
    }
}
