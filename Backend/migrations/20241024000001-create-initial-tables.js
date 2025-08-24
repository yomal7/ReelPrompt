"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create users table
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      profile_picture_url: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: "/images/default-profile.png",
      },
      role: {
        type: Sequelize.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Create movies table
    await queryInterface.createTable("movies", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      tmdb_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      poster_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      backdrop_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      overview: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      release_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      genres: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      runtime: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      vote_average: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: true,
      },
      vote_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      language: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: "en",
      },
      adult: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Create ratings table
    await queryInterface.createTable("ratings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      movie_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Create comments table
    await queryInterface.createTable("comments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      movie_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Create favorites table
    await queryInterface.createTable("favorites", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      movie_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Create suggestions table
    await queryInterface.createTable("suggestions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      prompt: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      suggested_movies: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });

    // Add indexes
    await queryInterface.addIndex("users", ["email"], { unique: true });
    await queryInterface.addIndex("users", ["username"], { unique: true });
    await queryInterface.addIndex("movies", ["tmdb_id"], { unique: true });
    await queryInterface.addIndex("movies", ["title"]);
    await queryInterface.addIndex("movies", ["release_date"]);
    await queryInterface.addIndex("ratings", ["user_id", "movie_id"], {
      unique: true,
    });
    await queryInterface.addIndex("favorites", ["user_id", "movie_id"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order due to foreign key constraints
    await queryInterface.dropTable("suggestions");
    await queryInterface.dropTable("favorites");
    await queryInterface.dropTable("comments");
    await queryInterface.dropTable("ratings");
    await queryInterface.dropTable("movies");
    await queryInterface.dropTable("users");

    // Drop enum type
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";'
    );
  },
};
