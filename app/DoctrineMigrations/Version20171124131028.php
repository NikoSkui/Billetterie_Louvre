<?php declare(strict_types = 1);

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171124131028 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE ns_booking (id INT AUTO_INCREMENT NOT NULL, date DATE NOT NULL, is_half TINYINT(1) NOT NULL, spaces INT NOT NULL, status INT NOT NULL, user_mail VARCHAR(255) DEFAULT NULL, price NUMERIC(5, 2) NOT NULL, created_at DATETIME NOT NULL, customer_id VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ns_booking_ticket (id INT AUTO_INCREMENT NOT NULL, booking_id INT NOT NULL, ticket_id INT NOT NULL, user_name VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, birthday DATE NOT NULL, is_reduce TINYINT(1) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) DEFAULT NULL, price NUMERIC(5, 2) NOT NULL, INDEX IDX_2A1091FB3301C60 (booking_id), INDEX IDX_2A1091FB700047D2 (ticket_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ns_ticket (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, min INT DEFAULT NULL, max INT DEFAULT NULL, price NUMERIC(6, 2) NOT NULL, image VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE ns_booking_ticket ADD CONSTRAINT FK_2A1091FB3301C60 FOREIGN KEY (booking_id) REFERENCES ns_booking (id)');
        $this->addSql('ALTER TABLE ns_booking_ticket ADD CONSTRAINT FK_2A1091FB700047D2 FOREIGN KEY (ticket_id) REFERENCES ns_ticket (id)');
    }

    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE ns_booking_ticket DROP FOREIGN KEY FK_2A1091FB3301C60');
        $this->addSql('ALTER TABLE ns_booking_ticket DROP FOREIGN KEY FK_2A1091FB700047D2');
        $this->addSql('DROP TABLE ns_booking');
        $this->addSql('DROP TABLE ns_booking_ticket');
        $this->addSql('DROP TABLE ns_ticket');
    }
}
