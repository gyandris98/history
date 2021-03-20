using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class EditorImageUpload
    {
        public int Success { get; set; }
        public Image File { get; set; }
    }
}
