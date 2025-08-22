namespace MovieApp.Core.Entities;

public class Suggestion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Prompt { get; set; } = string.Empty;

    // JSON array stored as string - PostgreSQL supports JSON columns
    public string SuggestedMovies { get; set; } = string.Empty; // Will store JSON like "[123, 456, 789]"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual User User { get; set; } = null!;
}

// Why store JSON as string?
// - PostgreSQL has excellent JSON support
// - We can store array of TMDB IDs without creating another table
// - Easy to serialize/deserialize in C#
// - Good for flexible data that doesn't need complex queries