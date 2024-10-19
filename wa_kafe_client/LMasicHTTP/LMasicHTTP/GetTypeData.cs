using System.Text.Json.Serialization;

namespace LMasicHTTP
{
    [JsonPolymorphic]
    [JsonDerivedType(typeof(GetPeopleData), "folder")]
    [JsonDerivedType(typeof(GetTypeData), "test")]
    public class GetTypeData : BaseGetData
    {
        [JsonPropertyName("typ")]
        public string Typ { get; set; }
    }
}
