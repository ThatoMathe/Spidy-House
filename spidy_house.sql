-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2025 at 02:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spidy_house`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`CategoryID`, `CategoryName`) VALUES
(1, 'Electronics'),
(2, 'Clothing'),
(3, 'Home Appliances'),
(4, 'Books'),
(5, 'Sports'),
(7, 'testing');

-- --------------------------------------------------------

--
-- Table structure for table `courier`
--

CREATE TABLE `courier` (
  `CourierID` int(11) NOT NULL,
  `CourierName` varchar(100) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `ContactNumber` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `courier`
--

INSERT INTO `courier` (`CourierID`, `CourierName`, `Address`, `ContactNumber`) VALUES
(1, 'Fast Couriers', '123 Main St, City Center, ZA', '0123456789');

-- --------------------------------------------------------

--
-- Table structure for table `customerorders`
--

CREATE TABLE `customerorders` (
  `CustomerOrderID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customerorders`
--

INSERT INTO `customerorders` (`CustomerOrderID`, `CustomerID`, `ProductID`, `Quantity`) VALUES
(1, 1, 25, 2),
(2, 2, 25, 1),
(3, 1, 25, 3),
(4, 3, 25, 5);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomerID` int(11) NOT NULL,
  `CustomerName` varchar(100) DEFAULT NULL,
  `CustomerAddress` varchar(200) DEFAULT NULL,
  `DeliveryID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerID`, `CustomerName`, `CustomerAddress`, `DeliveryID`) VALUES
(1, 'John Doe', '12 Oak Street, Cityview', 1),
(2, 'Jane Smith', '45 Maple Avenue, Uptown', 2),
(3, 'Alice Johnson', '78 Pine Road, Lakeside', 3);

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

CREATE TABLE `deliveries` (
  `DeliveryID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `CustomerName` varchar(100) DEFAULT NULL,
  `CustomerAddress` varchar(200) DEFAULT NULL,
  `CourierID` int(11) DEFAULT NULL,
  `Status` enum('Pending','Delivered','Cancelled') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `deliveries`
--

INSERT INTO `deliveries` (`DeliveryID`, `CustomerID`, `CustomerName`, `CustomerAddress`, `CourierID`, `Status`) VALUES
(1, 1, 'John Doe', '12 Oak Street, Cityview', 1, 'Pending'),
(2, 2, 'Jane Smith', '45 Maple Avenue, Uptown', 2, 'Pending'),
(3, 3, 'Alice Johnson', '78 Pine Road, Lakeside', 2, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `InventoryID` int(11) NOT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `SupplierID` int(11) DEFAULT NULL,
  `QuantityAvailable` int(11) DEFAULT NULL,
  `MinimumStockLevel` int(11) DEFAULT NULL,
  `MaximumStockLevel` int(11) DEFAULT NULL,
  `WarehouseID` int(11) DEFAULT NULL,
  `LastOrderDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`InventoryID`, `ProductID`, `SupplierID`, `QuantityAvailable`, `MinimumStockLevel`, `MaximumStockLevel`, `WarehouseID`, `LastOrderDate`) VALUES
(2, NULL, NULL, NULL, 5, 52, 1, '2025-05-16 21:44:50'),
(3, 41, 201, 0, 30, 100, 1, '2025-06-16 11:09:26'),
(7, 40, 202, 71, 6, 60, 2, '2025-06-04 19:33:37');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `act_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `user_id`, `act_id`, `created_at`) VALUES
(35, 'Users', 9, 9, '2025-06-26 15:16:38'),
(42, 'Users', 9, 9, '2025-06-26 15:32:44'),
(43, 'Users', 9, 9, '2025-06-26 17:42:57'),
(44, 'Users', 9, 9, '2025-06-26 18:00:27'),
(45, 'Users', 9, 9, '2025-06-26 18:03:56'),
(47, 'Users', 9, 9, '2025-06-26 18:20:52'),
(48, 'Users', 9, 9, '2025-06-26 18:20:52'),
(49, 'Users', 9, 9, '2025-06-26 18:21:04'),
(50, 'Users', 9, 9, '2025-06-26 18:27:29'),
(51, 'Users', 9, 9, '2025-06-26 19:04:59'),
(52, 'Users', 9, 9, '2025-06-27 11:52:44');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `ProductCode` varchar(100) DEFAULT NULL,
  `BarCode` varchar(100) DEFAULT NULL,
  `ProductName` varchar(100) DEFAULT NULL,
  `ProductDescription` varchar(2000) DEFAULT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `ProductImage` text DEFAULT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `SupplierID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `ProductCode`, `BarCode`, `ProductName`, `ProductDescription`, `OrderID`, `ProductImage`, `CategoryID`, `SupplierID`) VALUES
(40, 'P40', '23332224444456', 'Black T-Shirt', '', 0, '/uploads/products/product_1750071490_4221.jpeg', 2, 202),
(41, 'P41', '34333344377377', 'Smart Watch', '', 0, '/uploads/products/product_1750073237_4530.jpeg', 1, 201);

-- --------------------------------------------------------

--
-- Table structure for table `purchasingorders`
--

CREATE TABLE `purchasingorders` (
  `OrderID` int(11) NOT NULL,
  `OrderDate` datetime DEFAULT NULL,
  `OrderQuantity` int(11) DEFAULT NULL,
  `ExpectedDate` datetime DEFAULT NULL,
  `ActualDate` datetime DEFAULT NULL,
  `ProductID` int(11) NOT NULL,
  `SupplierID` int(11) DEFAULT NULL,
  `Status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `purchasingorders`
--

INSERT INTO `purchasingorders` (`OrderID`, `OrderDate`, `OrderQuantity`, `ExpectedDate`, `ActualDate`, `ProductID`, `SupplierID`, `Status`) VALUES
(1, '2025-04-25 09:00:00', 5, '2025-05-10 00:00:00', '2025-05-09 00:00:00', 40, 201, 'Approved'),
(2, '2025-04-26 10:00:00', 3, '2025-05-12 00:00:00', '2025-05-11 00:00:00', 41, 202, 'Pending'),
(3, '2025-06-24 23:59:57', 150, '2025-06-28 00:00:00', '0000-00-00 00:00:00', 41, 201, 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `SessionID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `IPAddress` varchar(45) DEFAULT NULL,
  `Token` varchar(255) DEFAULT NULL,
  `UserAgent` text DEFAULT NULL,
  `ResentDate` datetime DEFAULT NULL,
  `CreatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`SessionID`, `UserID`, `IPAddress`, `Token`, `UserAgent`, `ResentDate`, `CreatedAt`) VALUES
(1, 9, '::1', 'vro2qsc3ijn1s5k8riq6eord29', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-16 14:43:01'),
(2, 9, '::1', 'c7d9hkc6j346db0dtfuldh0h7l', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-24 22:44:19'),
(3, 9, '192.168.18.124', '1apqjrknidd2i1pbsopm44uqos', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', '2025-06-25 17:38:16', '2025-06-24 23:01:35'),
(4, 5, '192.168.18.147', 'ue2te3cbmiqd1tk4dmq2fuvua1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', '2025-06-24 23:16:03', '2025-06-24 23:11:55'),
(5, 9, '192.168.18.124', 'jqo0acpap5sf28k9iu59vf87nl', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', NULL, '2025-06-25 20:28:30'),
(6, 9, '192.168.18.124', 'kvsb1gept00rppl309hc3kr9pf', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-06-25 21:13:18', '2025-06-25 21:07:49'),
(7, 9, '192.168.18.124', 'nl0n1so62arfgrj9sv6pqefn3i', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-25 21:53:59'),
(8, 9, '192.168.18.4', 'rd9tjiavjpvqlvlol3qd8n0upf', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36', NULL, '2025-06-25 22:29:43'),
(9, 9, '192.168.18.124', '4lektue4fs0jhs6rp7ejsa6ov0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', NULL, '2025-06-25 23:19:51'),
(10, 9, '192.168.18.124', '215aomuaqgj14urqgg6112qev9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 13:29:04'),
(11, 9, '192.168.18.124', '85e1ko3v50m8uiop9ges831fs9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 13:48:09'),
(12, 5, '192.168.18.147', 'ln8d48k9rv5tvjm78ad0s762ss', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 13:49:36'),
(13, 5, '192.168.18.246', 'stc9fnphl20ujn5le623b8mu9a', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36', NULL, '2025-06-26 14:18:31'),
(14, 5, '192.168.18.246', '8k2lnkuthr1lauurhi2p1t9cmb', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36', NULL, '2025-06-26 14:53:30'),
(15, 9, '192.168.18.124', '3j6l4nqbejgmb4om6085e7e958', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 15:02:51'),
(16, 5, '192.168.18.147', 'v7400irh5mpof8a1522djggos9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 15:07:26'),
(17, 9, '192.168.18.124', 's5s7o2i4qsu6nc2un56og9r9mb', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 15:11:04'),
(18, 9, '192.168.18.124', '8vqfhskbnpm2bfe9id9as1o44r', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 15:16:38'),
(19, 9, '192.168.18.124', '163d4ahjadncn4nfl1vl9345gm', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 15:32:44'),
(20, 9, '192.168.18.4', 'u26915trhku0h8snle0a2j1noh', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36', '2025-06-26 18:20:52', '2025-06-26 17:42:57'),
(21, 9, '192.168.18.124', '8oco0k2k5eenu4t5lh9r9vd4c8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 18:00:27'),
(22, 9, '192.168.18.124', '465eralplkuonuc73nvgt9si52', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 18:03:56'),
(23, 5, '192.168.18.246', 'ea2tite5l6em6bp3mkm5vmmt3i', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36', NULL, '2025-06-26 18:06:41'),
(24, 9, '192.168.18.4', 'rck73gtba2n2j20pij5up425mm', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36', NULL, '2025-06-26 18:21:04'),
(25, 9, '::1', 'ail9l1ght2ifib8rttefp8em5m', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', '2025-06-26 19:04:58', '2025-06-26 18:27:28'),
(26, 9, '::1', 'sjt63iib7v5n7jenobmejstvvm', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-27 11:52:44');

-- --------------------------------------------------------

--
-- Table structure for table `stockreturns`
--

CREATE TABLE `stockreturns` (
  `StockReturnID` int(11) NOT NULL,
  `CustomerOrderID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `ReasonForReturn` varchar(300) DEFAULT NULL,
  `InventoryID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `stockreturns`
--

INSERT INTO `stockreturns` (`StockReturnID`, `CustomerOrderID`, `ProductID`, `Quantity`, `ReasonForReturn`, `InventoryID`) VALUES
(1, 1, 101, 2, 'Defective product', 1001),
(2, 2, 102, 1, 'Wrong size', 1002),
(3, NULL, 40, 15, 'Returned from transfer cancellation', 7);

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `StoreID` int(11) NOT NULL,
  `StoreName` varchar(100) DEFAULT NULL,
  `StoreLocation` varchar(200) DEFAULT NULL,
  `ManagerID` int(11) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`StoreID`, `StoreName`, `StoreLocation`, `ManagerID`, `CreatedDate`) VALUES
(1, 'Spidy Main Branch', '123 Central Ave, Johannesburg', 8, '2025-05-29 16:18:29'),
(2, 'Cape Town Outlet', '45 Ocean View Rd, Cape Town', 5, '2025-05-29 16:18:29'),
(4, 'Durban Hub', '89 Marine Parade, Durban', NULL, '2025-05-29 16:18:29');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `SupplierID` int(11) NOT NULL,
  `SupplierName` varchar(100) DEFAULT NULL,
  `SupplierAddress` varchar(200) DEFAULT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`SupplierID`, `SupplierName`, `SupplierAddress`, `CreatedDate`) VALUES
(201, 'Tech Supplies Inc.', '123 Tech Park, Silicon Valley', '2025-05-13 12:01:43'),
(202, 'Fashion Wholesale', '45 Fashion St, Garment District', '2025-05-13 12:01:43'),
(203, 'Appliance Traders', '80 Appliance Rd, Home City', '2025-05-13 12:01:43');

-- --------------------------------------------------------

--
-- Table structure for table `transfers`
--

CREATE TABLE `transfers` (
  `TransferID` int(11) NOT NULL,
  `TransferQuantity` int(11) DEFAULT NULL,
  `SentDate` datetime DEFAULT NULL,
  `ReceivedDate` datetime DEFAULT NULL,
  `WarehouseID` int(11) DEFAULT NULL,
  `FromWarehouseID` int(11) DEFAULT NULL,
  `StoreID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `transfers`
--

INSERT INTO `transfers` (`TransferID`, `TransferQuantity`, `SentDate`, `ReceivedDate`, `WarehouseID`, `FromWarehouseID`, `StoreID`, `ProductID`) VALUES
(1, 100, '2025-05-01 08:00:00', '2025-05-02 09:00:00', 1, 1, NULL, 25),
(2, 50, '2025-05-03 10:00:00', '2025-05-04 11:00:00', NULL, 1, 2, 26),
(3, 10, '2025-06-04 20:32:57', '2025-06-12 20:30:00', NULL, 2, 1, 38);

-- --------------------------------------------------------

--
-- Table structure for table `useractivity`
--

CREATE TABLE `useractivity` (
  `ReportID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `Description` text DEFAULT NULL,
  `Title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `useractivity`
--

INSERT INTO `useractivity` (`ReportID`, `UserID`, `CreatedAt`, `Description`, `Title`) VALUES
(1, 9, '2025-06-04 18:03:05', 'Updated warehouse [1]', 'Warehouse'),
(2, 9, '2025-06-04 18:35:03', 'Modified settings', 'Settings'),
(6, 9, '2025-06-04 18:57:17', 'Modified settings', 'Settings'),
(7, 9, '2025-06-04 18:57:51', 'Deleted product [34]', 'Products'),
(8, 9, '2025-06-04 18:58:45', 'Deleted product [28]', 'Products'),
(9, 9, '2025-06-04 19:05:11', 'Proccesed product [35]', 'Products'),
(10, 9, '2025-06-04 19:05:20', 'Deleted product [ID: 35]', 'Products'),
(11, 9, '2025-06-04 19:06:31', 'Proccesed product [36]', 'Products'),
(12, 9, '2025-06-04 19:06:41', 'Deleted product [ID: 36]', 'Products'),
(13, 9, '2025-06-04 20:09:34', 'Proccesed product [37]', 'Products'),
(14, 9, '2025-06-04 20:10:01', 'Proccesed product [38]', 'Products'),
(15, 9, '2025-06-04 20:15:35', 'Proccesed product [39]', 'Products'),
(16, 9, '2025-06-04 21:25:46', 'Modified inventory', 'Inventory'),
(17, 9, '2025-06-04 21:26:05', 'Modified inventory', 'Inventory'),
(18, 9, '2025-06-04 21:28:11', 'Modified inventory', 'Inventory'),
(19, 9, '2025-06-04 21:28:31', 'Modified inventory', 'Inventory'),
(20, 9, '2025-06-04 21:32:45', 'Modified settings', 'Settings'),
(21, 9, '2025-06-04 21:33:01', 'Deleted product [ID: 39]', 'Products'),
(22, 9, '2025-06-04 21:33:04', 'Deleted product [ID: 37]', 'Products'),
(23, 9, '2025-06-04 21:33:07', 'Deleted product [ID: 38]', 'Products'),
(24, 9, '2025-06-04 21:33:38', 'Proccesed product [40]', 'Products'),
(25, 9, '2025-06-04 21:33:53', 'Modified inventory', 'Inventory'),
(26, 9, '2025-06-04 21:34:22', 'Modified settings', 'Settings'),
(27, 9, '2025-06-04 21:35:01', 'Modified store [1]', 'Stores'),
(28, 9, '2025-06-04 21:38:27', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(29, 9, '2025-06-04 21:40:44', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(30, 9, '2025-06-04 21:41:04', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(31, 9, '2025-06-04 23:23:35', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(32, 9, '2025-06-16 00:41:22', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(33, 9, '2025-06-16 00:44:52', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(34, 9, '2025-06-16 12:22:48', 'Modified inventory', 'Inventory'),
(35, 9, '2025-06-16 12:55:18', 'Modified product [40]', 'Products'),
(36, 9, '2025-06-16 12:55:25', 'Modified product [40]', 'Products'),
(37, 9, '2025-06-16 12:55:25', 'Modified product [40]', 'Products'),
(38, 9, '2025-06-16 12:56:24', 'Modified product [40]', 'Products'),
(39, 9, '2025-06-16 12:58:10', 'Modified product [40]', 'Products'),
(40, 9, '2025-06-16 13:09:26', 'Proccesed product [41]', 'Products'),
(41, 9, '2025-06-16 13:25:46', 'Modified product [41]', 'Products'),
(42, 9, '2025-06-16 13:25:55', 'Modified product [41]', 'Products'),
(43, 9, '2025-06-16 13:26:02', 'Modified product [41]', 'Products'),
(44, 9, '2025-06-16 13:27:17', 'Modified product [41]', 'Products'),
(45, 9, '2025-06-16 13:45:14', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(46, 9, '2025-06-16 13:46:46', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(47, 9, '2025-06-16 13:49:50', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(48, 9, '2025-06-16 14:33:56', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(49, 9, '2025-06-16 14:42:06', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(50, 9, '2025-06-16 14:43:01', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(51, 9, '2025-06-24 22:44:19', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(52, 9, '2025-06-24 22:45:45', 'Modified settings', 'Settings'),
(53, 9, '2025-06-24 23:01:35', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(54, 5, '2025-06-24 23:11:55', 'Logged in user [5] [Rivaldo]', 'Users'),
(55, 5, '2025-06-24 23:12:36', 'Logged in user [5] [Rivaldo]', 'Users'),
(56, 5, '2025-06-24 23:14:15', 'Logged in user [5] [Rivaldo]', 'Users'),
(57, 5, '2025-06-24 23:16:03', 'Logged in user [5] [Rivaldo]', 'Users'),
(58, 9, '2025-06-25 00:55:24', 'Modified product [41]', 'Products'),
(59, 9, '2025-06-25 00:55:47', 'Modified inventory', 'Inventory'),
(60, 9, '2025-06-25 01:13:28', 'Modified product [41]', 'Products'),
(61, 9, '2025-06-25 01:13:33', 'Modified product [41]', 'Products'),
(62, 9, '2025-06-25 01:14:28', 'Modified product [41]', 'Products'),
(63, 9, '2025-06-25 01:16:50', 'Modified product [41]', 'Products'),
(64, 9, '2025-06-25 01:17:50', 'Modified product [41]', 'Products'),
(65, 9, '2025-06-25 01:18:39', 'Modified product [41]', 'Products'),
(66, 9, '2025-06-25 01:19:05', 'Modified product [41]', 'Products'),
(67, 9, '2025-06-25 17:38:16', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(68, 9, '2025-06-25 18:04:39', 'Modified store [1]', 'Stores'),
(69, 9, '2025-06-25 18:07:16', 'Added category [testing]', 'Categories'),
(70, 9, '2025-06-25 18:15:34', 'Modified inventory', 'Inventory'),
(71, 9, '2025-06-25 18:59:39', 'Modified inventory [7]', 'Inventory'),
(72, 9, '2025-06-25 19:00:59', 'Modified inventory [7]', 'Inventory'),
(73, 9, '2025-06-25 19:02:55', 'Updated warehouse [1]', 'Warehouse'),
(74, 9, '2025-06-25 19:05:56', 'Modified inventory [3]', 'Inventory'),
(75, 9, '2025-06-25 19:45:30', 'Modified inventory [7]', 'Inventory'),
(76, 9, '2025-06-25 19:45:48', 'Modified inventory [3]', 'Inventory'),
(77, 9, '2025-06-25 19:59:52', 'Modified product [41]', 'Products'),
(78, 9, '2025-06-25 20:04:33', 'Modified product [41]', 'Products'),
(79, 9, '2025-06-25 20:28:30', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(80, 9, '2025-06-25 21:07:49', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(81, 9, '2025-06-25 21:13:18', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(82, 9, '2025-06-25 21:53:59', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(83, 9, '2025-06-25 22:29:43', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(84, 9, '2025-06-25 23:09:58', 'Modified inventory [3]', 'Inventory'),
(85, 9, '2025-06-25 23:19:51', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(86, 9, '2025-06-25 23:34:40', 'Added user [Thabo] to warehouse [1]', 'Users'),
(87, 9, '2025-06-26 13:29:04', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(88, 9, '2025-06-26 13:48:10', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(89, 9, '2025-06-26 13:49:09', 'Modified product [41]', 'Products'),
(90, 5, '2025-06-26 13:49:36', 'Logged in user [5] [Rivaldo]', 'Users'),
(91, 9, '2025-06-26 13:50:30', 'Modified inventory [7]', 'Inventory'),
(92, 9, '2025-06-26 13:50:48', 'Modified inventory [3]', 'Inventory'),
(93, 9, '2025-06-26 13:51:24', 'Modified inventory [3]', 'Inventory'),
(94, 5, '2025-06-26 13:52:01', 'Modified inventory [3]', 'Inventory'),
(95, 5, '2025-06-26 14:18:32', 'Logged in user [5] [Rivaldo]', 'Users'),
(96, 5, '2025-06-26 14:53:30', 'Logged in user [5] [Rivaldo]', 'Users'),
(97, 9, '2025-06-26 15:02:51', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(98, 5, '2025-06-26 15:07:26', 'Logged in user [5] [Rivaldo]', 'Users'),
(99, 5, '2025-06-26 15:10:25', 'Modified user [5]', 'Users'),
(100, 5, '2025-06-26 15:10:42', 'Modified store [1]', 'Stores'),
(101, 9, '2025-06-26 15:11:04', 'Logged in user [9] [Ronaldo Makale]', 'Users'),
(102, 5, '2025-06-26 15:11:04', 'Updated warehouse [1]', 'Warehouse'),
(103, 5, '2025-06-26 15:14:04', 'Modified product [41]', 'Products'),
(104, 5, '2025-06-26 15:14:21', 'Modified inventory [7]', 'Inventory'),
(105, 5, '2025-06-26 15:15:03', 'Modified inventory [3]', 'Inventory'),
(106, 9, '2025-06-26 15:16:38', 'Logged in user [9] [Makale]', 'Users'),
(107, 5, '2025-06-26 15:20:23', 'Modified product [41]', 'Products'),
(108, 5, '2025-06-26 15:22:03', 'Modified product [40]', 'Products'),
(109, 5, '2025-06-26 15:22:43', 'Modified product [41]', 'Products'),
(110, 5, '2025-06-26 15:22:56', 'Modified product [41]', 'Products'),
(111, 5, '2025-06-26 15:28:19', 'Modified inventory [3]', 'Inventory'),
(112, 5, '2025-06-26 15:28:54', 'Modified inventory [3]', 'Inventory'),
(113, 9, '2025-06-26 15:32:44', 'Logged in user [9] [Makale]', 'Users'),
(114, 9, '2025-06-26 17:42:57', 'Logged in user [9] [Makale]', 'Users'),
(115, 9, '2025-06-26 18:00:27', 'Logged in user [9] [Makale]', 'Users'),
(116, 9, '2025-06-26 18:03:56', 'Logged in user [9] [Makale]', 'Users'),
(117, 5, '2025-06-26 18:06:41', 'Logged in user [5] [Rivaldo]', 'Users'),
(118, 9, '2025-06-26 18:20:52', 'Logged in user [9] [Makale]', 'Users'),
(119, 9, '2025-06-26 18:20:52', 'Logged in user [9] [Makale]', 'Users'),
(120, 9, '2025-06-26 18:21:04', 'Logged in user [9] [Makale]', 'Users'),
(121, 9, '2025-06-26 18:27:29', 'Logged in user [9] [Makale]', 'Users'),
(122, 9, '2025-06-26 19:04:59', 'Logged in user [9] [Makale]', 'Users'),
(123, 9, '2025-06-27 11:52:44', 'Logged in user [9] [Makale]', 'Users'),
(124, 9, '2025-06-27 11:58:44', 'Modified settings', 'Settings'),
(125, 9, '2025-06-27 12:13:13', 'Modified settings', 'Settings');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `Email` text NOT NULL,
  `Password` varchar(200) DEFAULT NULL,
  `Role` varchar(100) DEFAULT NULL,
  `is_2fa_enabled` int(1) NOT NULL DEFAULT 0,
  `is_2fa_verified` tinyint(1) NOT NULL DEFAULT 0,
  `two_fa_code` int(6) NOT NULL,
  `CreatedDate` datetime DEFAULT current_timestamp(),
  `WarehouseID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `UserName`, `Email`, `Password`, `Role`, `is_2fa_enabled`, `is_2fa_verified`, `two_fa_code`, `CreatedDate`, `WarehouseID`) VALUES
(5, 'Rivaldo', 'rivaldomakale@gmail.com', '$2y$10$7WCV9pNGE/u0lUgV14U3j.RWpGiOM3SZX2K5e.zDWyBi8l3sq6WNO', 'admin', 0, 0, 873856, '2025-05-12 19:42:20', 2),
(8, 'joytick', 'joytick.business@gmail.com', NULL, 'admin', 1, 0, 0, '2025-05-13 11:10:39', 2),
(9, 'Makale', 'thabomakale486@gmail.com', '$2y$10$vR/Cl0IiQp/AUWsvl012SO4N6RXQJn8grX.PLdl1bJ5HrIbEs6z4G', 'admin', 0, 0, 722297, '2025-06-02 18:24:54', 1),
(10, 'Thabo', 'test@gmail.com', '$2y$10$NPwaagHVfKxbJqdT7ci3zesCN2AkvYA0pLgdwrJjBuq52BAP0NIqq', 'admin', 0, 0, 0, '2025-06-25 23:34:40', 1);

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `WarehouseID` int(11) NOT NULL,
  `WarehouseName` varchar(100) DEFAULT NULL,
  `LocationName` varchar(100) DEFAULT NULL,
  `LocationAddress` varchar(300) DEFAULT NULL,
  `TransferID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`WarehouseID`, `WarehouseName`, `LocationName`, `LocationAddress`, `TransferID`) VALUES
(1, 'Main Warehouse', 'Central Location', '123 Warehouse Blvd, CityCenter', 1001),
(2, 'East Warehouse', 'Eastside Location', '45 East Road, Uptown', 1002);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `courier`
--
ALTER TABLE `courier`
  ADD PRIMARY KEY (`CourierID`);

--
-- Indexes for table `customerorders`
--
ALTER TABLE `customerorders`
  ADD PRIMARY KEY (`CustomerOrderID`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerID`);

--
-- Indexes for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`DeliveryID`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`InventoryID`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`);

--
-- Indexes for table `purchasingorders`
--
ALTER TABLE `purchasingorders`
  ADD PRIMARY KEY (`OrderID`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`SessionID`);

--
-- Indexes for table `stockreturns`
--
ALTER TABLE `stockreturns`
  ADD PRIMARY KEY (`StockReturnID`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`StoreID`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`SupplierID`);

--
-- Indexes for table `transfers`
--
ALTER TABLE `transfers`
  ADD PRIMARY KEY (`TransferID`);

--
-- Indexes for table `useractivity`
--
ALTER TABLE `useractivity`
  ADD PRIMARY KEY (`ReportID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`WarehouseID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `courier`
--
ALTER TABLE `courier`
  MODIFY `CourierID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customerorders`
--
ALTER TABLE `customerorders`
  MODIFY `CustomerOrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `DeliveryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `InventoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `purchasingorders`
--
ALTER TABLE `purchasingorders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `SessionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `stockreturns`
--
ALTER TABLE `stockreturns`
  MODIFY `StockReturnID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `StoreID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `SupplierID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT for table `transfers`
--
ALTER TABLE `transfers`
  MODIFY `TransferID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `useractivity`
--
ALTER TABLE `useractivity`
  MODIFY `ReportID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `WarehouseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
