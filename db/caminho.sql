-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2018 at 12:27 PM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `arthurac_caminho`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` enum('article','book','action','socialize') COLLATE utf8_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `filter` int(11) NOT NULL,
  `nVisits` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `tag` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `external_link` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `video_link` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nLikes` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nBads` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `reviewers` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comments` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `type`, `author`, `filter`, `nVisits`, `tag`, `image_url`, `external_link`, `title`, `video_link`, `content`, `nLikes`, `nBads`, `reviewers`, `comments`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'article', '3', 1, '48', 'Brazil politics', 'upload/images/3/1533531606blog-img-8.jpg', 'www.cnn.com', 'First Article', 'upload/videos/3/1533531606record-10.50.21[06.08.2018].mp4', 'zxczxczxczxc', '1', NULL, NULL, '2', NULL, '2018-08-05 21:00:06', '2018-08-06 01:11:59'),
(2, 'book', '3', 9, NULL, NULL, 'upload/images/3/1533538662latest-vid-img-3.jpg', NULL, 'book1', 'upload/videos/3/1533538662record-10.50.21[06.08.2018].mp4', 'Book 1 content', NULL, NULL, NULL, NULL, NULL, '2018-08-05 22:57:42', '2018-08-05 22:57:42');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(10) UNSIGNED NOT NULL,
  `articleId` int(11) NOT NULL,
  `viewer_email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `viewer_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `thumb` enum('up','down') COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8_unicode_ci NOT NULL,
  `reply_comment` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `articleId`, `viewer_email`, `viewer_name`, `thumb`, `content`, `reply_comment`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'user1@caminho.com', 'user1', NULL, 'This is the first comment', NULL, NULL, '2018-08-06 00:18:17', '2018-08-06 00:18:17'),
(2, 1, 'editor1@caminho.com', 'user1', 'up', 'This is very good', NULL, NULL, '2018-08-06 00:36:09', '2018-08-06 00:36:09');

-- --------------------------------------------------------

--
-- Table structure for table `filter_types`
--

CREATE TABLE `filter_types` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` enum('article','book','action','socialize') COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `filter_types`
--

INSERT INTO `filter_types` (`id`, `type`, `name`, `label`) VALUES
(1, 'article', 'political_science', 'Political Science'),
(2, 'article', 'psychology', 'Psychology'),
(3, 'article', 'economy', 'Economy'),
(4, 'article', 'history', 'History'),
(5, 'action', 'planning', 'Planning'),
(6, 'action', 'tools', 'Tools'),
(8, 'article', 'lessons', 'Lessons'),
(9, 'book', 'science', 'Science'),
(10, 'book', 'physical', 'Physical'),
(11, 'book', 'economy', 'Economy'),
(12, 'book', 'history', 'History'),
(13, 'action', 'planning', 'Planning'),
(14, 'action', 'tools', 'Tools'),
(15, 'socialize', 'facebook_groups', 'Facebook Groups'),
(16, 'socialize', 'meetup_groups', 'Meetup Groups'),
(17, 'socialize', 'other blogs', 'Other Blogs');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(9, '2018_08_01_125742_create_articles_table', 2),
(10, '2018_08_01_130452_create_comments_table', 2),
(11, '2018_08_01_131437_create_filter_types_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `role` enum('admin','editor','user') DEFAULT 'user',
  `editor_status` enum('pending','verified','rejected','none') DEFAULT 'none',
  `other` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `remember_token`, `created_at`, `updated_at`, `role`, `editor_status`, `other`) VALUES
(2, 'admin', 'admin@caminho.com', '$2y$10$Ma4C7Kzz38g/SotMwchK4OqEEVOhHMmmClcVKf2H9ElNv0xFWf7Le', NULL, 'AJAahUh3oaTjvPPJrVT0Kr4ncjXcWrUD7Jh3NeKFjoI7Tx3kmvQz3xOVA4kO', '2018-08-06 06:54:02', '2018-08-06 06:54:02', 'admin', 'none', NULL),
(3, 'editor1', 'editor1@caminho.com', '$2y$10$I5hJ1gxa7VME0I5GvQipuuR8KGnr.UjmlucPiOnRcot0nc1JLKW8a', '8624123123', '7DcKliIjLHFoTgQVpSaZNnBxcihLA2Kfx39vU2CXZuXjQeMpyCHr5ArivZ29', '2018-08-06 07:16:23', '2018-08-06 07:16:23', 'editor', 'verified', 'I want to be an Editor of this site.\r\nI think this site is very excellent.'),
(4, 'user1', 'user1@caminho.com', '$2y$10$7ruIet6R4tZOPum3SLGH9.2Ztli2u6OrsEAUtT2s6.GB53YaoV8iy', NULL, NULL, '2018-08-06 00:15:51', '2018-08-06 00:15:51', 'user', 'none', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `filter_types`
--
ALTER TABLE `filter_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `filter_types`
--
ALTER TABLE `filter_types`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
