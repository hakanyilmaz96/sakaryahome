namespace API.Dtos
{
    // Kullanıcıya döndürdüğümüz product'ın özelliklerini daha düzenli hale getirmek için
    public class ProductsToReturnDto
    {

        public int Id { get; set; }
        public string Name {get; set;}
        public string Description {get; set;}
        public decimal Price {get; set;}
        public string PictureUrl {get; set;}
        public string ProductType {get; set;}
        public string ProductBrand {get; set;}
        public int Desi {get; set;}
        public bool Logistic {get; set;}
   
    }
}