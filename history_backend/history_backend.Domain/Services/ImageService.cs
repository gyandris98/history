using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using history_backend.Domain.DTO;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace history_backend.Domain.Services
{
    public class ImageService
    {
        private readonly Cloudinary cloudinary;
        private readonly string folderLocation = "\\Upload\\Temp\\";
        public ImageService(Cloudinary cloudinary)
        {
            this.cloudinary = cloudinary;
        }

        private async Task<Image> Upload(string path)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(path)
            };
            var uploadResult = await cloudinary.UploadAsync(uploadParams);

            return new Image
            {
                Id = uploadResult.PublicId,
                CreatedAt = uploadResult.CreatedAt,
                Width = uploadResult.Width,
                Height = uploadResult.Height,
                Url = uploadResult.SecureUrl.ToString(),
                Bytes = uploadResult.Bytes
            };
        }

        public async Task<Image> UploadImage(IHostEnvironment env, FileUpload file)
        {
            if (file.image == null)
            {
                throw new Exception("Not enough arguments");
            }

            var directoryPath = env.ContentRootPath + folderLocation;

            if (file.image.Length > 0)
            {
                try
                {
                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }
                    var filename = $"temp-{file.image.FileName}";
                    using FileStream fileStream = File.Create(directoryPath + filename);
                    await file.image.CopyToAsync(fileStream);
                    fileStream.Flush();
                    fileStream.Close();

                    return await Upload(directoryPath + filename);
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }
                finally
                {
                    var di = new DirectoryInfo(directoryPath);
                    foreach (FileInfo f in di.GetFiles())
                    {
                        f.Delete();
                    }
                    foreach (DirectoryInfo dir in di.GetDirectories())
                    {
                        dir.Delete(true);
                    }
                }
               
            } else
            {
                throw new Exception("Not enough arguments");
            }
        }

        public async Task<EditorImageUpload> UploadEditorImage(IHostEnvironment env, FileUpload file)
        {
            try
            {
                var image = await UploadImage(env, file);
                return new EditorImageUpload
                {
                    File = image,
                    Success = 1
                };
            }
            catch (Exception)
            {
                throw new Exception("Upload failed");
            }
        }
        public async Task<EditorImageUpload> UploadEditorImageByUrl(IHostEnvironment env, FileUploadByUrl file)
        {
            try
            {
                var image = await Upload(file.Url);
                return new EditorImageUpload
                {
                    File = image,
                    Success = 1
                };
            }
            catch (Exception)
            {
                throw new Exception("Upload failed");
            }
        }
        public async Task DeleteImage(string id)
        {
            var res = await cloudinary.DeleteResourcesAsync(ResourceType.Image, id);
            if (res.DeletedCounts.Count == 0) throw new Exception("Error on delete");
        }
    }
}
