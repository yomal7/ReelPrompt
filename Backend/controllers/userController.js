// controllers/userController.js
const { User, Rating, Comment, Favorite, Movie } = require("../models");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               profilePictureUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
const updateProfile = async (req, res) => {
  try {
    const { name, profilePictureUrl } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (profilePictureUrl !== undefined)
      updateData.profilePictureUrl = profilePictureUrl;

    await User.update(updateData, {
      where: { id: userId },
    });

    const updatedUser = await User.findByPk(userId);

    res.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
    });
  }
};

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password
    const user = await User.findByPk(userId, {
      attributes: ["id", "passwordHash"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await User.update(
      { passwordHash: hashedNewPassword },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      error: "Failed to change password",
    });
  }
};

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get user's favorite movies
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's favorite movies
 */
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const favorites = await Favorite.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Movie,
          as: "movie",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        favorites: favorites.rows,
        totalCount: favorites.count,
        totalPages: Math.ceil(favorites.count / parseInt(limit)),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch favorites",
    });
  }
};

/**
 * @swagger
 * /api/users/ratings:
 *   get:
 *     summary: Get user's movie ratings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's movie ratings
 */
const getRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const ratings = await Rating.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Movie,
          as: "movie",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        ratings: ratings.rows,
        totalCount: ratings.count,
        totalPages: Math.ceil(ratings.count / parseInt(limit)),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch ratings",
    });
  }
};

/**
 * @swagger
 * /api/users/comments:
 *   get:
 *     summary: Get user's movie comments
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's movie comments
 */
const getComments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Movie,
          as: "movie",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        comments: comments.rows,
        totalCount: comments.count,
        totalPages: Math.ceil(comments.count / parseInt(limit)),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch comments",
    });
  }
};

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user's activity stats
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's activity statistics
 */
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts
    const [ratingsCount, commentsCount, favoritesCount] = await Promise.all([
      Rating.count({ where: { userId } }),
      Comment.count({ where: { userId } }),
      Favorite.count({ where: { userId } }),
    ]);

    // Get average rating given by user
    const avgRating = await Rating.findOne({
      where: { userId },
      attributes: [
        [Rating.sequelize.fn("AVG", Rating.sequelize.col("rating")), "average"],
      ],
    });

    res.json({
      success: true,
      data: {
        ratingsCount,
        commentsCount,
        favoritesCount,
        averageRating: avgRating
          ? parseFloat(avgRating.dataValues.average).toFixed(1)
          : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user stats",
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    // Verify password before deletion
    const user = await User.findByPk(userId, {
      attributes: ["passwordHash"],
    });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Password is incorrect",
      });
    }

    // Delete all user data (cascade will handle related records)
    await User.destroy({ where: { id: userId } });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete account",
    });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  getFavorites,
  getRatings,
  getComments,
  getUserStats,
  deleteAccount,
};
