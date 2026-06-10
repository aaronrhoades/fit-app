using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Routing;

namespace FitAppApi.Infrastructure.Routing;

public class KebabCaseParameterTransformer : IOutboundParameterTransformer
{
    public string? TransformOutbound(object? value)
    {
        if (value is null) return null;

        // Convert PascalCase/camelCase to kebab-case
        return Regex.Replace(
            value.ToString()!,
            "([a-z0-9])([A-Z])",
            "$1-$2",
            RegexOptions.Compiled)
            .ToLower();
    }
}
