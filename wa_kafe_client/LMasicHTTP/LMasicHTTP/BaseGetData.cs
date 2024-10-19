using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace LMasicHTTP
{
    [JsonPolymorphic]
    [JsonDerivedType(typeof(GetPeopleData))]
    [JsonDerivedType(typeof(GetTypeData))]
    public class BaseGetData
    {
        [JsonPropertyName("ID")]
        public int ID { get; set; }
    }
}
