using Microsoft.AspNetCore.Identity;

namespace ReelPrompt.Core.Entities;

// In .NET, we inherit from IdentityUser instead of creating our own User class
// IdentityUser already provides Id, Email, PasswordHash, and more authentication fields
public class User : IdentityUser<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties for relationships
    // These allow Entity Framework to understand the relationships between tables
    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public virtual ICollection<Suggestion> Suggestions { get; set; } = new List<Suggestion>();
}

// Why inherit from IdentityUser?
// - IdentityUser provides built-in authentication features
// - Includes Id, Email, PasswordHash, SecurityStamp, etc.
// - Integrates seamlessly with ASP.NET Core Identity system
// - Handles password hashing, email confirmation, etc. automatically