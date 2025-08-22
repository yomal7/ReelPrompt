namespace ReelPrompt.Core.Entities;

public class Rating
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Foreign Keys - these link to other tables
    public Guid UserId { get; set; }
    public Guid MovieId { get; set; }

    public int RatingValue { get; set; } // 1-5 stars
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties - Entity Framework uses these to join tables
    public virtual User User { get; set; } = null!;
    public virtual Movie Movie { get; set; } = null!;
}

// What are Foreign Keys?
// - They reference the primary key of another table
// - Create relationships between tables (User -> Rating, Movie -> Rating)
// - Entity Framework uses them to generate proper SQL JOINs
// - The "virtual" keyword enables lazy loading (loads related data when accessed)