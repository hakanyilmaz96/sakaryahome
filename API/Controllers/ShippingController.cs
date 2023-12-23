using API.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShippingController : ControllerBase
    {
        // Şehir ismine göre mesafeyi döndüren bir endpoint
        [HttpGet("citydistance/{city}")]
        public ActionResult<double> GetDistanceFromCity(string city)
        {
            if (Enum.TryParse(city, true, out CityDistance cityDistance))
            {
                return (double)cityDistance;
            }
            return 0;
        }
    }
}