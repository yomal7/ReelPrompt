using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ReelPrompt.Core.Entities;

namespace ReelPrompt.Infrastructure.Data;

// DbContext is Entity Framework's main class for database operations
// IdentityDbContext provides built-in authentication tables
public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSet properties represent database tables
    // Entity Framework automatically creates tables based on these
    public DbSet<Movie> Movies { get; set; } = null!;
    public DbSet<Rating> Ratings { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<Favorite> Favorites { get; set; } = null!;
    public DbSet<Suggestion> Suggestions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); // Important: sets up Identity tables

        // Configure entity relationships and constraints
        ConfigureMovieEntity(builder);
        ConfigureRatingEntity(builder);
        ConfigureCommentEntity(builder);
        ConfigureFavoriteEntity(builder);
        ConfigureSuggestionEntity(builder);
    }

    private static void ConfigureMovieEntity(ModelBuilder builder)
    {
        builder.Entity<Movie>(entity =>
        {
            // Make TmdbId unique (one record per TMDB movie)
            entity.HasIndex(e => e.TmdbId).IsUnique();

            // Set required fields
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.PosterUrl).HasMaxLength(1000);
            entity.Property(e => e.Overview).HasMaxLength(2000);
        });
    }

    private static void ConfigureRatingEntity(ModelBuilder builder)
    {
        builder.Entity<Rating>(entity =>
        {
            // One user can only rate one movie once
            entity.HasIndex(e => new { e.UserId, e.MovieId }).IsUnique();

            // Rating value must be between 1 and 5
            entity.Property(e => e.RatingValue).IsRequired();
            entity.HasCheckConstraint("CK_Rating_Value", "\"RatingValue\" >= 1 AND \"RatingValue\" <= 5");

            // Configure foreign key relationships
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Ratings)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade); // Delete ratings when user is deleted

            entity.HasOne(e => e.Movie)
                  .WithMany(m => m.Ratings)
                  .HasForeignKey(e => e.MovieId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureCommentEntity(ModelBuilder builder)
    {
        builder.Entity<Comment>(entity =>
        {
            entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Comments)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Movie)
                  .WithMany(m => m.Comments)
                  .HasForeignKey(e => e.MovieId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureFavoriteEntity(ModelBuilder builder)
    {
        builder.Entity<Favorite>(entity =>
        {
            // One user can only favorite one movie once
            entity.HasIndex(e => new { e.UserId, e.MovieId }).IsUnique();

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Favorites)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Movie)
                  .WithMany(m => m.Favorites)
                  .HasForeignKey(e => e.MovieId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureSuggestionEntity(ModelBuilder builder)
    {
        builder.Entity<Suggestion>(entity =>
        {
            entity.Property(e => e.Prompt).IsRequired().HasMaxLength(500);
            entity.Property(e => e.SuggestedMovies).IsRequired(); // JSON string

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Suggestions)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

// Key DbContext Concepts:
// 1. DbSet<T> - Represents a table in database
// 2. OnModelCreating - Configure relationships, constraints, indexes
// 3. Migrations - Version control for database schema changes
// 4. Entity Framework translates LINQ queries to SQL automatically