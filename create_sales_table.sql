-- Create Sales table manually
-- Run this SQL in your MySQL database

CREATE TABLE IF NOT EXISTS `Sales` (
  `SaleId` INT NOT NULL AUTO_INCREMENT,
  `SpaId` INT NOT NULL,
  `BookingId` INT NULL,
  `CustomerName` VARCHAR(100) NOT NULL,
  `ServiceName` VARCHAR(100) NOT NULL,
  `Amount` DECIMAL(10, 2) NOT NULL,
  `PaymentMethod` VARCHAR(50) DEFAULT 'Cash',
  `SaleDate` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`SaleId`),
  INDEX `SpaId` (`SpaId`),
  INDEX `BookingId` (`BookingId`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`SpaId`) REFERENCES `SpaOrganizations` (`SpaId`) ON DELETE CASCADE,
  CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`BookingId`) REFERENCES `Bookings` (`BookingId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
