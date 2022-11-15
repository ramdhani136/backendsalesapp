-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 14, 2022 at 11:39 AM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `salesapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  `lng` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `deskripsi`, `id_user`, `lat`, `lng`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'PT. Ekatunggal Tunas Mandiri', 'Utama Bogor', 1, NULL, NULL, 1, '2022-07-13 05:59:10', '2022-07-13 05:59:10'),
(2, 'CV. Ekatunggal Timur', 'Surabaya', 1, NULL, NULL, 1, '2022-07-13 11:04:15', '2022-07-13 11:04:15');

-- --------------------------------------------------------

--
-- Table structure for table `callsheets`
--

CREATE TABLE `callsheets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_customer` int(11) DEFAULT NULL,
  `id_customerGroup` int(11) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `callType` enum('in','out') DEFAULT NULL,
  `priceNote` text DEFAULT NULL,
  `remindOrderNote` text DEFAULT NULL,
  `billingNote` text DEFAULT NULL,
  `compInformNote` text DEFAULT NULL,
  `deliveryNote` text DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `surveyNote` text DEFAULT NULL,
  `id_branch` int(11) NOT NULL,
  `surveyAt` datetime DEFAULT NULL,
  `isSurvey` tinyint(1) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `callsheets`
--

INSERT INTO `callsheets` (`id`, `name`, `id_customer`, `id_customerGroup`, `pic`, `phone`, `callType`, `priceNote`, `remindOrderNote`, `billingNote`, `compInformNote`, `deliveryNote`, `id_user`, `rating`, `surveyNote`, `id_branch`, `surveyAt`, `isSurvey`, `status`, `createdAt`, `updatedAt`) VALUES
(2, 'haha', 3, 3, NULL, '', 'in', NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, 2, '2022-07-13 06:17:49', 0, 1, '2022-07-13 06:17:49', '2022-07-13 06:17:49'),
(4, 'tes', 3, 3, NULL, '', 'in', NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, 1, '2022-07-13 06:17:49', 0, 1, '2022-07-13 06:17:49', '2022-07-13 06:17:49');

-- --------------------------------------------------------

--
-- Table structure for table `customergroups`
--

CREATE TABLE `customergroups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `id_branch` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customergroups`
--

INSERT INTO `customergroups` (`id`, `name`, `deskripsi`, `id_user`, `id_branch`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Area 1', NULL, 1, 1, 1, '2022-07-13 06:15:22', '2022-07-13 06:15:22'),
(2, 'Area 2', NULL, 1, 1, 1, '2022-07-13 06:15:22', '2022-07-13 06:15:22'),
(3, 'Sby 1', NULL, 1, 2, 1, '2022-07-13 06:15:22', '2022-07-13 06:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Company','Individual') DEFAULT NULL,
  `id_customerGroup` int(11) NOT NULL,
  `id_branch` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  `lng` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `type`, `id_customerGroup`, `id_branch`, `id_user`, `email`, `phone`, `pic`, `lat`, `lng`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'PT. Maju Mundur', 'Company', 1, 1, 1, NULL, NULL, NULL, NULL, NULL, 1, '2022-07-13 06:15:58', '2022-07-13 06:15:58'),
(2, 'PT. Untung Nggk', 'Company', 2, 1, 1, NULL, NULL, NULL, NULL, NULL, 1, '2022-07-13 06:16:22', '2022-07-13 06:16:22'),
(3, 'PT. Masa Bodo', 'Company', 2, 2, 3, NULL, NULL, NULL, NULL, NULL, 1, '2022-07-13 06:16:44', '2022-07-13 06:16:44');

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `id_branch` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `devices`
--

INSERT INTO `devices` (`id`, `name`, `deskripsi`, `id_user`, `id_branch`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Sales App Bogor', NULL, 1, 1, 1, '2022-07-13 06:26:01', '2022-07-13 06:26:01');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `allow` enum('branch','user','customer','customergroup') DEFAULT NULL,
  `uniqid` varchar(255) NOT NULL,
  `alldoc` tinyint(1) NOT NULL DEFAULT 0,
  `doc` enum('customer','customergroup','callsheet','visit','device','rolelist','roleuser','roleprofile','user','branch') DEFAULT NULL,
  `value` varchar(255) NOT NULL,
  `id_created` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `id_user`, `allow`, `uniqid`, `alldoc`, `doc`, `value`, `id_created`, `status`, `createdAt`, `updatedAt`) VALUES
(27, 1, 'branch', '1branch1customer', 0, 'customer', '1', 1, 1, '2022-07-14 08:12:07', '2022-07-14 08:12:07'),
(28, 1, 'branch', '1branch1customergroup', 0, 'customergroup', '1', 1, 1, '2022-07-14 08:12:07', '2022-07-14 08:12:07'),
(32, 1, 'branch', '1branch1branch', 0, 'branch', '1', 1, 1, '2022-07-14 08:34:49', '2022-07-14 08:34:49'),
(36, 1, 'branch', '1branch1callsheet', 0, 'callsheet', '1', 1, 1, '2022-07-14 09:08:14', '2022-07-14 09:08:14'),
(37, 1, 'branch', '1branch1visit', 0, 'visit', '1', 1, 1, '2022-07-14 09:30:22', '2022-07-14 09:30:22');

-- --------------------------------------------------------

--
-- Table structure for table `rolelists`
--

CREATE TABLE `rolelists` (
  `id` int(11) NOT NULL,
  `id_role` int(11) NOT NULL,
  `doc` enum('branch','callsheet','visit','customer','customerGroup','device','roleprofile','user','rolelist','roleuser','permission') NOT NULL,
  `roleid` varchar(255) NOT NULL,
  `create` tinyint(1) DEFAULT 1,
  `read` tinyint(1) DEFAULT 1,
  `update` tinyint(1) DEFAULT 1,
  `delete` tinyint(1) DEFAULT 0,
  `amend` tinyint(1) DEFAULT 0,
  `submit` tinyint(1) DEFAULT 0,
  `report` tinyint(1) DEFAULT 0,
  `export` tinyint(1) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `id_user` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rolelists`
--

INSERT INTO `rolelists` (`id`, `id_role`, `doc`, `roleid`, `create`, `read`, `update`, `delete`, `amend`, `submit`, `report`, `export`, `status`, `id_user`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'branch', '1branch', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(2, 1, 'callsheet', '1callsheet', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(3, 1, 'visit', '1visit', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(4, 1, 'customer', '1customer', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(5, 1, 'customerGroup', '1customerGroup', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(6, 1, 'device', '1device', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(7, 1, 'roleprofile', '1roleprofile', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(8, 1, 'user', '1user', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(9, 1, 'rolelist', '1rolelist', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(10, 1, 'roleuser', '1roleuser', 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 05:54:10', '2022-07-13 05:54:10'),
(11, 2, 'callsheet', '2callsheet', 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, '2022-07-13 06:07:03', '2022-07-13 06:07:03'),
(12, 2, 'visit', '2visit', 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, '2022-07-13 06:07:03', '2022-07-13 06:07:03'),
(13, 2, 'customerGroup', '2customerGroup', 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, '2022-07-13 06:07:50', '2022-07-13 06:07:50'),
(14, 2, 'user', '2user', 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, '2022-07-13 06:07:50', '2022-07-13 06:07:50'),
(15, 1, 'permission', '1permission', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2022-07-13 11:34:43', '2022-07-13 11:34:43'),
(16, 2, 'customer', '2customer', 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, '2022-07-14 05:36:31', '2022-07-14 05:36:31');

-- --------------------------------------------------------

--
-- Table structure for table `roleprofiles`
--

CREATE TABLE `roleprofiles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_branch` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roleprofiles`
--

INSERT INTO `roleprofiles` (`id`, `name`, `id_user`, `id_branch`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Administrator', 1, 1, 1, '2022-07-13 05:51:21', '2022-07-13 05:51:21'),
(2, 'Sales Staff', 1, 1, 1, '2022-07-13 05:51:21', '2022-07-13 05:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `roleusers`
--

CREATE TABLE `roleusers` (
  `id` int(11) NOT NULL,
  `id_roleprofile` int(11) NOT NULL,
  `uniqid` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roleusers`
--

INSERT INTO `roleusers` (`id`, `id_roleprofile`, `uniqid`, `id_user`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, '11', 1, 1, '2022-07-13 05:51:46', '2022-07-13 05:51:46'),
(6, 2, '23', 3, 1, '2022-07-13 06:10:50', '2022-07-13 06:10:50');

-- --------------------------------------------------------

--
-- Table structure for table `taskvisits`
--

CREATE TABLE `taskvisits` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `deskripsi` text NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_sales` int(11) DEFAULT NULL,
  `id_customerGroup` int(11) DEFAULT NULL,
  `id_branch` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `closeAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `img` text DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `phone`, `password`, `img`, `refresh_token`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Ilham Ramdhani', 'ramdhaniit', NULL, NULL, '$2b$10$9S54vEsVKYjpgjxynFPKG.RnAkhWiUa.fRIN2JRKXPutq0MeHPfeu', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm5hbWUiOiJJbGhhbSBSYW1kaGFuaSIsInVzZXJuYW1lIjoicmFtZGhhbmlpdCIsImVtYWlsIjpudWxsLCJwaG9uZSI6bnVsbCwiaW1nIjpudWxsLCJyb2xlIjpbeyJpZCI6MSwiaWRfcm9sZXByb2ZpbGUiOjEsInN0YXR1cyI6dHJ1ZSwicm9sZXByb2ZpbGUiOnsiaWQiOjEsIm5hbWUiOiJBZG1pbmlzdHJhdG9yIiwic3RhdHVzIjp0cnVlLCJyb2xlbGlzdCI6W3siaWQiOjEsImRvYyI6ImJyYW5jaCIsImNyZWF0ZSI6dHJ1ZSwicmVhZCI6dHJ1ZSwidXBkYXRlIjp0cnVlLCJkZWxldGUiOnRydWUsImFtZW5kIjp0cnVlLCJzdWJtaXQiOnRydWUsInJlcG9ydCI6dHJ1ZSwiZXhwb3J0Ijp0cnVlLCJzdGF0dXMiOnRydWV9LHsiaWQiOjIsImRvYyI6ImNhbGxzaGVldCIsImNyZWF0ZSI6dHJ1ZSwicmVhZCI6dHJ1ZSwidXBkYXRlIjp0cnVlLCJkZWxldGUiOnRydWUsImFtZW5kIjp0cnVlLCJzdWJtaXQiOnRydWUsInJlcG9ydCI6dHJ1ZSwiZXhwb3J0Ijp0cnVlLCJzdGF0dXMiOnRydWV9LHsiaWQiOjMsImRvYyI6InZpc2l0IiwiY3JlYXRlIjp0cnVlLCJyZWFkIjp0cnVlLCJ1cGRhdGUiOnRydWUsImRlbGV0ZSI6dHJ1ZSwiYW1lbmQiOnRydWUsInN1Ym1pdCI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJleHBvcnQiOnRydWUsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NCwiZG9jIjoiY3VzdG9tZXIiLCJjcmVhdGUiOnRydWUsInJlYWQiOnRydWUsInVwZGF0ZSI6dHJ1ZSwiZGVsZXRlIjp0cnVlLCJhbWVuZCI6dHJ1ZSwic3VibWl0Ijp0cnVlLCJyZXBvcnQiOnRydWUsImV4cG9ydCI6dHJ1ZSwic3RhdHVzIjp0cnVlfSx7ImlkIjo1LCJkb2MiOiJjdXN0b21lckdyb3VwIiwiY3JlYXRlIjp0cnVlLCJyZWFkIjp0cnVlLCJ1cGRhdGUiOnRydWUsImRlbGV0ZSI6dHJ1ZSwiYW1lbmQiOnRydWUsInN1Ym1pdCI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJleHBvcnQiOnRydWUsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NiwiZG9jIjoiZGV2aWNlIiwiY3JlYXRlIjp0cnVlLCJyZWFkIjp0cnVlLCJ1cGRhdGUiOnRydWUsImRlbGV0ZSI6dHJ1ZSwiYW1lbmQiOnRydWUsInN1Ym1pdCI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJleHBvcnQiOnRydWUsInN0YXR1cyI6dHJ1ZX0seyJpZCI6NywiZG9jIjoicm9sZXByb2ZpbGUiLCJjcmVhdGUiOnRydWUsInJlYWQiOnRydWUsInVwZGF0ZSI6dHJ1ZSwiZGVsZXRlIjp0cnVlLCJhbWVuZCI6dHJ1ZSwic3VibWl0Ijp0cnVlLCJyZXBvcnQiOnRydWUsImV4cG9ydCI6dHJ1ZSwic3RhdHVzIjp0cnVlfSx7ImlkIjo4LCJkb2MiOiJ1c2VyIiwiY3JlYXRlIjp0cnVlLCJyZWFkIjp0cnVlLCJ1cGRhdGUiOnRydWUsImRlbGV0ZSI6dHJ1ZSwiYW1lbmQiOnRydWUsInN1Ym1pdCI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJleHBvcnQiOnRydWUsInN0YXR1cyI6dHJ1ZX0seyJpZCI6OSwiZG9jIjoicm9sZWxpc3QiLCJjcmVhdGUiOnRydWUsInJlYWQiOnRydWUsInVwZGF0ZSI6dHJ1ZSwiZGVsZXRlIjp0cnVlLCJhbWVuZCI6dHJ1ZSwic3VibWl0Ijp0cnVlLCJyZXBvcnQiOnRydWUsImV4cG9ydCI6dHJ1ZSwic3RhdHVzIjp0cnVlfSx7ImlkIjoxMCwiZG9jIjoicm9sZXVzZXIiLCJjcmVhdGUiOnRydWUsInJlYWQiOmZhbHNlLCJ1cGRhdGUiOnRydWUsImRlbGV0ZSI6dHJ1ZSwiYW1lbmQiOnRydWUsInN1Ym1pdCI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJleHBvcnQiOnRydWUsInN0YXR1cyI6dHJ1ZX0seyJpZCI6MTUsImRvYyI6InBlcm1pc3Npb24iLCJjcmVhdGUiOnRydWUsInJlYWQiOnRydWUsInVwZGF0ZSI6dHJ1ZSwiZGVsZXRlIjp0cnVlLCJhbWVuZCI6dHJ1ZSwic3VibWl0Ijp0cnVlLCJyZXBvcnQiOnRydWUsImV4cG9ydCI6dHJ1ZSwic3RhdHVzIjp0cnVlfV19fV0sImlhdCI6MTY1Nzc3ODAxNywiZXhwIjoxNjU3ODY0NDE3fQ.R03Z5eGgInjydDYZzCLJecxFiH5nKDvEHGQYSn5FzbM', 1, '2022-07-13 03:49:07', '2022-07-14 05:53:37'),
(3, 'Ryan Hadi Dermawan', 'ryan', NULL, NULL, '$2b$10$FcOvk/65Ci6Zwffzqs4Abu6RGlbs2TENAQk6Kky0DkYOh5eKfy3iy', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsIm5hbWUiOiJSeWFuIEhhZGkgRGVybWF3YW4iLCJ1c2VybmFtZSI6InJ5YW4iLCJlbWFpbCI6bnVsbCwicGhvbmUiOm51bGwsImltZyI6bnVsbCwicm9sZSI6W3siaWQiOjYsImlkX3JvbGVwcm9maWxlIjoyLCJzdGF0dXMiOnRydWUsInJvbGVwcm9maWxlIjp7ImlkIjoyLCJuYW1lIjoiU2FsZXMgU3RhZmYiLCJzdGF0dXMiOnRydWUsInJvbGVsaXN0IjpbeyJpZCI6MTEsImRvYyI6ImNhbGxzaGVldCIsImNyZWF0ZSI6dHJ1ZSwicmVhZCI6dHJ1ZSwidXBkYXRlIjp0cnVlLCJkZWxldGUiOmZhbHNlLCJhbWVuZCI6dHJ1ZSwic3VibWl0Ijp0cnVlLCJyZXBvcnQiOnRydWUsImV4cG9ydCI6dHJ1ZSwic3RhdHVzIjp0cnVlfSx7ImlkIjoxMiwiZG9jIjoidmlzaXQiLCJjcmVhdGUiOnRydWUsInJlYWQiOnRydWUsInVwZGF0ZSI6dHJ1ZSwiZGVsZXRlIjpmYWxzZSwiYW1lbmQiOnRydWUsInN1Ym1pdCI6dHJ1ZSwicmVwb3J0Ijp0cnVlLCJleHBvcnQiOnRydWUsInN0YXR1cyI6dHJ1ZX0seyJpZCI6MTMsImRvYyI6ImN1c3RvbWVyR3JvdXAiLCJjcmVhdGUiOmZhbHNlLCJyZWFkIjp0cnVlLCJ1cGRhdGUiOmZhbHNlLCJkZWxldGUiOmZhbHNlLCJhbWVuZCI6ZmFsc2UsInN1Ym1pdCI6ZmFsc2UsInJlcG9ydCI6ZmFsc2UsImV4cG9ydCI6ZmFsc2UsInN0YXR1cyI6dHJ1ZX0seyJpZCI6MTQsImRvYyI6InVzZXIiLCJjcmVhdGUiOmZhbHNlLCJyZWFkIjp0cnVlLCJ1cGRhdGUiOmZhbHNlLCJkZWxldGUiOmZhbHNlLCJhbWVuZCI6ZmFsc2UsInN1Ym1pdCI6ZmFsc2UsInJlcG9ydCI6ZmFsc2UsImV4cG9ydCI6ZmFsc2UsInN0YXR1cyI6dHJ1ZX0seyJpZCI6MTYsImRvYyI6ImN1c3RvbWVyIiwiY3JlYXRlIjpmYWxzZSwicmVhZCI6dHJ1ZSwidXBkYXRlIjpmYWxzZSwiZGVsZXRlIjpmYWxzZSwiYW1lbmQiOmZhbHNlLCJzdWJtaXQiOmZhbHNlLCJyZXBvcnQiOnRydWUsImV4cG9ydCI6dHJ1ZSwic3RhdHVzIjp0cnVlfV19fV0sImlhdCI6MTY1Nzc2OTkxMCwiZXhwIjoxNjU3ODU2MzEwfQ.xrCpjGvtPGCbhz4JeePwKrb5-OC0RURjb-3AYra_xyA', 1, '2022-07-13 04:06:14', '2022-07-14 03:38:30');

-- --------------------------------------------------------

--
-- Table structure for table `visits`
--

CREATE TABLE `visits` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_customer` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `priceNote` text DEFAULT NULL,
  `remindOrderNote` text DEFAULT NULL,
  `billingNote` text DEFAULT NULL,
  `compInformNote` text DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `signature` text DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  `lng` varchar(255) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `surveyNote` text DEFAULT NULL,
  `id_customerGroup` int(11) DEFAULT NULL,
  `id_branch` int(11) NOT NULL,
  `surveyAt` datetime DEFAULT NULL,
  `isSurvey` tinyint(1) DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `visits`
--

INSERT INTO `visits` (`id`, `name`, `id_customer`, `address`, `pic`, `phone`, `priceNote`, `remindOrderNote`, `billingNote`, `compInformNote`, `img`, `signature`, `lat`, `lng`, `id_user`, `rating`, `surveyNote`, `id_customerGroup`, `id_branch`, `surveyAt`, `isSurvey`, `status`, `createdAt`, `updatedAt`) VALUES
(36, 'VST20220700001', 1, NULL, NULL, '02518754436dd', NULL, NULL, NULL, NULL, 'VST20220700001.jpg', NULL, NULL, NULL, 1, NULL, NULL, NULL, 1, NULL, 0, 1, '2022-07-14 09:34:54', '2022-07-14 09:34:54'),
(37, 'VST20220700002', 1, NULL, NULL, '02518754436dd', NULL, NULL, NULL, NULL, 'VST20220700002.jpg', NULL, NULL, NULL, 1, NULL, NULL, NULL, 1, NULL, 0, 1, '2022-07-14 09:34:56', '2022-07-14 09:34:56'),
(38, 'VST20220700003', 1, NULL, NULL, '02518754436dd', NULL, NULL, NULL, NULL, 'VST20220700003.jpg', NULL, NULL, NULL, 1, NULL, NULL, NULL, 1, NULL, 0, 1, '2022-07-14 09:35:41', '2022-07-14 09:35:41'),
(39, 'VST20220700004', 1, NULL, NULL, '02518754436dd', NULL, NULL, NULL, NULL, 'VST20220700004.jpg', NULL, NULL, NULL, 1, NULL, NULL, NULL, 1, NULL, 0, 1, '2022-07-14 09:35:43', '2022-07-14 09:35:43'),
(40, 'VST20220700005', 1, NULL, NULL, '02518754436dd', NULL, NULL, NULL, NULL, 'VST20220700005.jpg', NULL, NULL, NULL, 1, NULL, NULL, NULL, 1, NULL, 0, 1, '2022-07-14 09:35:48', '2022-07-14 09:35:48'),
(41, 'VST20220700006', 1, NULL, NULL, '02518754436dd', NULL, NULL, NULL, NULL, 'VST20220700006.jpg', NULL, NULL, NULL, 1, NULL, NULL, NULL, 1, NULL, 0, 1, '2022-07-14 09:37:47', '2022-07-14 09:37:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `callsheets`
--
ALTER TABLE `callsheets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id_customer` (`id_customer`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_branch` (`id_branch`);

--
-- Indexes for table `customergroups`
--
ALTER TABLE `customergroups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `id_customerGroup` (`id_customerGroup`),
  ADD KEY `id_branch` (`id_branch`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_branch` (`id_branch`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniqid` (`uniqid`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_created` (`id_created`);

--
-- Indexes for table `rolelists`
--
ALTER TABLE `rolelists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roleid` (`roleid`),
  ADD KEY `id_role` (`id_role`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `roleprofiles`
--
ALTER TABLE `roleprofiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_branch` (`id_branch`);

--
-- Indexes for table `roleusers`
--
ALTER TABLE `roleusers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniqid` (`uniqid`),
  ADD KEY `id_roleprofile` (`id_roleprofile`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `taskvisits`
--
ALTER TABLE `taskvisits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id_customer` (`id_customer`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_branch` (`id_branch`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `callsheets`
--
ALTER TABLE `callsheets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customergroups`
--
ALTER TABLE `customergroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `rolelists`
--
ALTER TABLE `rolelists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `roleprofiles`
--
ALTER TABLE `roleprofiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roleusers`
--
ALTER TABLE `roleusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `taskvisits`
--
ALTER TABLE `taskvisits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `visits`
--
ALTER TABLE `visits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `branches_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `callsheets`
--
ALTER TABLE `callsheets`
  ADD CONSTRAINT `callsheets_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `callsheets_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `callsheets_ibfk_3` FOREIGN KEY (`id_branch`) REFERENCES `branches` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`id_customerGroup`) REFERENCES `customergroups` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `customers_ibfk_2` FOREIGN KEY (`id_branch`) REFERENCES `branches` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `customers_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `rolelists`
--
ALTER TABLE `rolelists`
  ADD CONSTRAINT `rolelists_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roleprofiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `roleusers`
--
ALTER TABLE `roleusers`
  ADD CONSTRAINT `roleusers_ibfk_1` FOREIGN KEY (`id_roleprofile`) REFERENCES `roleprofiles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `roleusers_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `visits`
--
ALTER TABLE `visits`
  ADD CONSTRAINT `visits_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `visits_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `visits_ibfk_3` FOREIGN KEY (`id_branch`) REFERENCES `branches` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
