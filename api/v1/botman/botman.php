<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager, staff');

use BotMan\BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Drivers\DriverManager;
use BotMan\Drivers\Web\WebDriver;

// Load the driver
DriverManager::loadDriver(WebDriver::class);

// Config
$config = [];

// Convert GET to what BotMan expects
if (isset($_GET['message'])) {
    $_POST['driver'] = 'web';
    $_POST['userId'] = 'web-user';
    $_POST['message'] = $_GET['message'];
    $_SERVER['REQUEST_METHOD'] = 'GET'; // Force POST handling
}



// Log input
file_put_contents('botman_log.txt', file_get_contents('php://input') . PHP_EOL, FILE_APPEND);








$botman = BotManFactory::create($config);

// Gemini API key
$GEMINI_API_KEY = $_ENV['GEMINI_API'] ?? '-'; // Replace with your real key
$commands = ['top customer','customer deliveries','staff per warehouse','unverified stock','products with barcode','products pending approval','transfers today','products in warehouse','products by category','top category','latest delivery','rejected orders','approved orders','products with no stock','unassigned products','most active warehouse','top supplier','latest customer','latest product','total users','help','customer list','courier list','return requests','pending orders','total couriers','total customers','total categories','total suppliers','least stocked product','most stocked product','list warehouses','stock summary','recent orders','low stock','hi', 'how many items', 'generate report', 'how are you'];
  
// Gemini-powered fallback
$botman->fallback(function (BotMan $bot) use ($commands, $GEMINI_API_KEY, $conn) {
    $userInput = $bot->getMessage()->getText();
    $matched = geminiMatch($userInput, $commands, $GEMINI_API_KEY);

    if (!in_array($matched, $commands)) {
        $bot->reply("Sorry, I didn't understand that.");
        return;
    }

        // Handle matched command
// Handle matched command
switch ($matched) {
    case 'hi':
        $bot->reply("Hi there!");
        break;

    case 'how many items':
        $result = $conn->query("SELECT SUM(QuantityAvailable) AS total FROM inventory");
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("We currently have a total of {$row['total']} item(s) in inventory.");
        } else {
            $bot->reply("Sorry, I couldn't retrieve the total item count.");
        }
        break;


    case 'generate report':
        $result = $conn->query("SELECT COUNT(*) AS totalItems, SUM(QuantityAvailable) AS totalStock FROM inventory");
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("📊 Report:\n- Total inventory records: {$row['totalItems']}\n- Total stock: {$row['totalStock']}");
        } else {
            $bot->reply("Could not generate report.");
        }
        break;

    case 'low stock':
        $sql = "SELECT ProductName, QuantityAvailable FROM inventory JOIN products ON inventory.ProductID = products.ProductID WHERE QuantityAvailable <= MinimumStockLevel";
        $result = $conn->query($sql);
        if ($result && $result->num_rows > 0) {
            $msg = "📉 Low stock items:\n";
            while ($row = $result->fetch_assoc()) {
                $msg .= "- {$row['ProductName']} ({$row['QuantityAvailable']})\n";
            }
            $bot->reply($msg);
        } else {
            $bot->reply("✅ All stock levels are healthy.");
        }
        break;

    case 'recent orders':
        $result = $conn->query("SELECT OrderID, OrderDate FROM purchasingorders ORDER BY OrderDate DESC LIMIT 5");
        if ($result && $result->num_rows > 0) {
            $msg = "🧾 Recent Purchasing Orders:\n";
            while ($row = $result->fetch_assoc()) {
                $msg .= "- Order #{$row['OrderID']} on {$row['OrderDate']}\n";
            }
            $bot->reply($msg);
        } else {
            $bot->reply("No recent orders found.");
        }
        break;

    case 'stock summary':
        $sql = "SELECT c.CategoryName, SUM(i.QuantityAvailable) AS total 
                FROM inventory i
                JOIN products p ON i.ProductID = p.ProductID
                JOIN categories c ON p.CategoryID = c.CategoryID
                GROUP BY c.CategoryID";
        $result = $conn->query($sql);
        if ($result && $result->num_rows > 0) {
            $msg = "📦 Stock Summary by Category:\n";
            while ($row = $result->fetch_assoc()) {
                $msg .= "- {$row['CategoryName']}: {$row['total']} units\n";
            }
            $bot->reply($msg);
        } else {
            $bot->reply("Unable to generate stock summary.");
        }
        break;

        case 'list warehouses':
        $result = $conn->query("SELECT WarehouseName, LocationName FROM warehouse");
        if ($result && $result->num_rows > 0) {
            $msg = "🏢 Registered Warehouses:\n";
            while ($row = $result->fetch_assoc()) {
                $msg .= "- {$row['WarehouseName']} ({$row['LocationName']})\n";
            }
            $bot->reply($msg);
        } else {
            $bot->reply("No warehouses found.");
        }
        break;

    case 'most stocked product':
        $sql = "SELECT ProductName, QuantityAvailable FROM inventory 
                JOIN products ON inventory.ProductID = products.ProductID 
                ORDER BY QuantityAvailable DESC LIMIT 1";
        $result = $conn->query($sql);
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("🔥 Most stocked: {$row['ProductName']} ({$row['QuantityAvailable']} units)");
        } else {
            $bot->reply("No stock data available.");
        }
        break;

    case 'least stocked product':
        $sql = "SELECT ProductName, QuantityAvailable FROM inventory 
                JOIN products ON inventory.ProductID = products.ProductID 
                WHERE QuantityAvailable > 0 
                ORDER BY QuantityAvailable ASC LIMIT 1";
        $result = $conn->query($sql);
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("⚠️ Least stocked: {$row['ProductName']} ({$row['QuantityAvailable']} units)");
        } else {
            $bot->reply("No stock data available.");
        }
        break;

    case 'total suppliers':
        $result = $conn->query("SELECT COUNT(*) AS count FROM suppliers");
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("🔗 We have {$row['count']} registered suppliers.");
        } else {
            $bot->reply("Unable to retrieve supplier count.");
        }
        break;

    case 'total categories':
        $result = $conn->query("SELECT COUNT(*) AS count FROM categories");
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("📂 We have {$row['count']} product categories.");
        } else {
            $bot->reply("Unable to retrieve category count.");
        }
        break;

    case 'total customers':
        $result = $conn->query("SELECT COUNT(*) AS count FROM customers");
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("👥 We have {$row['count']} customers.");
        } else {
            $bot->reply("Could not fetch customer count.");
        }
        break;

    case 'total couriers':
        $result = $conn->query("SELECT COUNT(*) AS count FROM courier");
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("🚚 Registered couriers: {$row['count']}.");
        } else {
            $bot->reply("Unable to retrieve courier info.");
        }
        break;

    case 'pending orders':
        $result = $conn->query("SELECT COUNT(*) AS count FROM purchasingorders WHERE Status = 'Pending'");
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("🕓 Pending orders: {$row['count']}.");
        } else {
            $bot->reply("No pending orders found.");
        }
        break;

    case 'return requests':
        $result = $conn->query("SELECT COUNT(*) AS count FROM stockreturns");
        if ($result && $row = $result->fetch_assoc()) {
            $bot->reply("↩️ Stock return requests: {$row['count']}.");
        } else {
            $bot->reply("Could not fetch return data.");
        }
        break;

    case 'courier list':
        $result = $conn->query("SELECT CourierName FROM courier LIMIT 5");
        if ($result && $result->num_rows > 0) {
            $msg = "🚚 Couriers:\n";
            while ($row = $result->fetch_assoc()) {
                $msg .= "- {$row['CourierName']}\n";
            }
            $bot->reply($msg);
        } else {
            $bot->reply("No couriers found.");
        }
        break;

    case 'customer list':
        $result = $conn->query("SELECT CustomerName FROM customers LIMIT 10");
        if ($result && $result->num_rows > 0) {
            $msg = "📋 Customers:\n";
            while ($row = $result->fetch_assoc()) {
                $msg .= "- {$row['CustomerName']}\n";
            }
            $bot->reply($msg);
        } else {
            $bot->reply("No customers found.");
        }
        break;

    case 'how are you':
        $bot->reply("I'm just a bot, but I'm running smoothly! 🤖");
        break;

    case 'bye':
        $bot->reply("Goodbye! Stay productive.");
        break;

    case 'help':
        $bot->reply("📚 Commands:\n- hi\n- how are you\n- bye\n- how many items\n- generate report\n- low stock\n- recent orders\n- stock summary\n- list warehouses\n- most stocked product\n- least stocked product\n- total suppliers\n- total categories\n- total customers\n- total couriers\n- pending orders\n- return requests\n- courier list\n- customer list\n- help");
        break;

case 'total users':
    $result = $conn->query("SELECT COUNT(*) AS count FROM users");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("👤 Total users in the system: {$row['count']}.");
    } else {
        $bot->reply("Couldn't retrieve user count.");
    }
    break;

case 'latest product':
    $result = $conn->query("SELECT ProductName FROM products ORDER BY ProductID DESC LIMIT 1");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🆕 Latest product added: {$row['ProductName']}");
    } else {
        $bot->reply("No products found.");
    }
    break;
 
case 'latest customer':
    $result = $conn->query("SELECT CustomerName FROM customers ORDER BY CustomerID DESC LIMIT 1");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🧑‍💼 Latest customer added: {$row['CustomerName']}");
    } else {
        $bot->reply("No customer data found.");
    }
    break;

case 'top supplier':
    $sql = "SELECT s.SupplierName, COUNT(p.ProductID) AS product_count
            FROM suppliers s
            JOIN products p ON p.SupplierID = s.SupplierID
            GROUP BY s.SupplierID
            ORDER BY product_count DESC LIMIT 1";
    $result = $conn->query($sql);
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🏅 Top supplier: {$row['SupplierName']} (supplies {$row['product_count']} products)");
    } else {
        $bot->reply("Couldn't determine the top supplier.");
    }
    break;

case 'most active warehouse':
    $sql = "SELECT w.WarehouseName, COUNT(t.TransferID) AS transfer_count
            FROM warehouse w
            JOIN transfers t ON t.WarehouseID = w.WarehouseID
            GROUP BY w.WarehouseID
            ORDER BY transfer_count DESC LIMIT 1";
    $result = $conn->query($sql);
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🏭 Most active warehouse: {$row['WarehouseName']} ({$row['transfer_count']} transfers)");
    } else {
        $bot->reply("No warehouse activity found.");
    }
    break;

case 'unassigned products':
    $sql = "SELECT ProductName FROM products WHERE ProductID NOT IN (SELECT ProductID FROM inventory)";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        $msg = "❗ Products not assigned to inventory:\n";
        while ($row = $result->fetch_assoc()) {
            $msg .= "- {$row['ProductName']}\n";
        }
        $bot->reply($msg);
    } else {
        $bot->reply("All products are assigned to inventory.");
    }
    break;

case 'products with no stock':
    $sql = "SELECT p.ProductName FROM products p
            JOIN inventory i ON i.ProductID = p.ProductID
            WHERE i.QuantityAvailable = 0";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        $msg = "🚫 Out of stock products:\n";
        while ($row = $result->fetch_assoc()) {
            $msg .= "- {$row['ProductName']}\n";
        }
        $bot->reply($msg);
    } else {
        $bot->reply("✅ No products are currently out of stock.");
    }
    break;

case 'approved orders':
    $result = $conn->query("SELECT COUNT(*) AS count FROM purchasingorders WHERE Status = 'Approved'");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("✔️ Approved orders: {$row['count']}");
    } else {
        $bot->reply("Unable to retrieve approved orders.");
    }
    break;

case 'rejected orders':
    $result = $conn->query("SELECT COUNT(*) AS count FROM purchasingorders WHERE Status = 'Rejected'");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("❌ Rejected orders: {$row['count']}");
    } else {
        $bot->reply("Unable to retrieve rejected orders.");
    }
    break;

case 'latest delivery':
    $result = $conn->query("SELECT CustomerName, CustomerAddress FROM deliveries ORDER BY DeliveryID DESC LIMIT 1");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("📦 Latest delivery was to: {$row['CustomerName']} at {$row['CustomerAddress']}");
    } else {
        $bot->reply("No delivery records found.");
    }
    break;


case 'top category':
    $sql = "SELECT c.CategoryName, SUM(i.QuantityAvailable) AS total
            FROM inventory i
            JOIN products p ON i.ProductID = p.ProductID
            JOIN categories c ON p.CategoryID = c.CategoryID
            GROUP BY c.CategoryID
            ORDER BY total DESC LIMIT 1";
    $result = $conn->query($sql);
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🏆 Top category: {$row['CategoryName']} ({$row['total']} units)");
    } else {
        $bot->reply("No category data available.");
    }
    break;

case 'products by category':
    $result = $conn->query("SELECT c.CategoryName, COUNT(p.ProductID) AS total
                            FROM products p
                            JOIN categories c ON p.CategoryID = c.CategoryID
                            GROUP BY p.CategoryID");
    if ($result && $result->num_rows > 0) {
        $msg = "📚 Product Count by Category:\n";
        while ($row = $result->fetch_assoc()) {
            $msg .= "- {$row['CategoryName']}: {$row['total']}\n";
        }
        $bot->reply($msg);
    } else {
        $bot->reply("Couldn't find category data.");
    }
    break;

case 'products in warehouse':
    $result = $conn->query("SELECT w.WarehouseName, COUNT(i.InventoryID) AS total
                            FROM inventory i
                            JOIN warehouse w ON i.WarehouseID = w.WarehouseID
                            GROUP BY w.WarehouseID");
    if ($result && $result->num_rows > 0) {
        $msg = "🏬 Products by Warehouse:\n";
        while ($row = $result->fetch_assoc()) {
            $msg .= "- {$row['WarehouseName']}: {$row['total']} items\n";
        }
        $bot->reply($msg);
    } else {
        $bot->reply("No warehouse inventory found.");
    }
    break;

case 'transfers today':
    $today = date('Y-m-d');
    $result = $conn->query("SELECT COUNT(*) AS count FROM transfers WHERE DATE(SentDate) = '$today'");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🔄 Transfers made today: {$row['count']}");
    } else {
        $bot->reply("No transfers made today.");
    }
    break;

case 'products pending approval':
    $result = $conn->query("SELECT COUNT(*) AS count FROM purchasingorders WHERE Status = 'Pending'");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🕐 Pending approvals: {$row['count']} orders.");
    } else {
        $bot->reply("No pending product approvals.");
    }
    break;

case 'products with barcode':
    $result = $conn->query("SELECT COUNT(*) AS count FROM products WHERE BarCode IS NOT NULL AND BarCode <> ''");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🔍 Products with barcodes: {$row['count']}");
    } else {
        $bot->reply("No barcode data found.");
    }
    break;

case 'unverified stock':
    $result = $conn->query("SELECT COUNT(*) AS count FROM inventory WHERE QuantityAvailable IS NULL OR QuantityAvailable = 0");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🚫 Unverified or empty stock records: {$row['count']}");
    } else {
        $bot->reply("Inventory looks good — no unverified stock.");
    }
    break;

case 'staff per warehouse':
    $result = $conn->query("SELECT w.WarehouseName, COUNT(u.UserID) AS staff
                            FROM users u
                            JOIN warehouse w ON u.WarehouseID = w.WarehouseID
                            GROUP BY u.WarehouseID");
    if ($result && $result->num_rows > 0) {
        $msg = "👨‍🏭 Staff per Warehouse:\n";
        while ($row = $result->fetch_assoc()) {
            $msg .= "- {$row['WarehouseName']}: {$row['staff']} staff\n";
        }
        $bot->reply($msg);
    } else {
        $bot->reply("No staff assigned to warehouses.");
    }
    break;

case 'customer deliveries':
    $result = $conn->query("SELECT COUNT(*) AS count FROM deliveries");
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("📦 Total customer deliveries: {$row['count']}");
    } else {
        $bot->reply("No delivery data found.");
    }
    break;

case 'top customer':
    $sql = "SELECT c.CustomerName, COUNT(o.CustomerOrderID) AS orders
            FROM customers c
            JOIN customerorders o ON c.CustomerID = o.CustomerID
            GROUP BY o.CustomerID
            ORDER BY orders DESC LIMIT 1";
    $result = $conn->query($sql);
    if ($result && $row = $result->fetch_assoc()) {
        $bot->reply("🌟 Top customer: {$row['CustomerName']} ({$row['orders']} orders)");
    } else {
        $bot->reply("No customer order data available.");
    }
    break;




}



});


// Start BotMan
$botman->listen();

// Gemini match function
function geminiMatch($input, $commands, $apiKey)
{
    $prompt = "Match this user message to one of the following commands: [" . implode(", ", $commands) . "]. Respond only with the best match.\n\nUser message: \"$input\". if not match then 'Sorry, lt I didn't understand that.'";

    $payload = json_encode([
        "contents" => [[
            "parts" => [["text" => $prompt]]
        ]]
    ]);

    $ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => $payload
    ]);

    $response = curl_exec($ch);
    if (!$response) return '';

    $json = json_decode($response, true);
    $text = $json['candidates'][0]['content']['parts'][0]['text'] ?? '';

    $text = strtolower(trim($text));
    return in_array($text, $commands) ? $text : '';
}