// Infrastructure/AWS/SecretManagerService.cs
using System.Text.Json;
using Amazon;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;

namespace FitAppApi.AWS;
public class SecretManagerService
{
    private readonly IAmazonSecretsManager _client;

    public SecretManagerService(IAmazonSecretsManager client)
    {
        _client = client;
    }

    public async Task<string> GetDatabaseConnectionString()
    {
        var request = new GetSecretValueRequest 
        { 
            SecretId = "FitAppProd/RDS/Postgres" 
        };
        
        var response = await _client.GetSecretValueAsync(request);
        string secret = response.SecretString;

        // Parse the AWS JSON object
        var dbSettings = JsonSerializer.Deserialize<Dictionary<string, object>>(secret);
        // Manually build the Npgsql format: "Host=X;Port=Y;Database=Z;Username=U;Password=P"
        return $"Host={dbSettings?["host"]};" +
        $"Port={dbSettings?["port"]};" +
        $"Database={dbSettings?["dbname"]};" +
        $"Username={dbSettings?["username"]};" +
        $"Password={dbSettings?["password"]};";
            // + $"Include Error Detail=true;"; //DEV Only
    }
}