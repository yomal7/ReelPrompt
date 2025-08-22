namespace MovieApp.Core.Entities;

public class Movie
{
    public Guid Id { get; set; } = Guid.NewGuid(); // Primary Key - Guid provides unique identifiers
    public int TmdbId { get; set; } // The Movie Database API ID
    public string Title { get; set; } = string.Empty;
    public string? PosterUrl { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public string? Genre { get; set; }
    public string? Overview { get; set; }

    // Navigation properties - these create relationships in the database
    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}

// Why use Guid for Id?
// - Globally unique across different databases
// - Better for distributed systems
// - Prevents ID guessing in URLs
// - Standard practice in modern .NET applications