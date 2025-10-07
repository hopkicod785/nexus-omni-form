const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

class Database {
    constructor() {
        this.db = null;
        this.isPostgres = process.env.DATABASE_URL || process.env.POSTGRES_URL;
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            if (this.isPostgres) {
                await this.initPostgres();
            } else {
                await this.initSQLite();
            }
            await this.createTables();
            this.initialized = true;
            console.log('Database initialization completed');
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    async initPostgres() {
        try {
            this.db = new Pool({
                connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
            });
            console.log('Connected to PostgreSQL database');
        } catch (error) {
            console.error('PostgreSQL connection error:', error);
            throw error;
        }
    }

    async initSQLite() {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, 'submissions.db');
            console.log('Attempting to connect to SQLite database at:', dbPath);
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('SQLite connection error:', err);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database at:', dbPath);
                    resolve();
                }
            });
        });
    }

    async createTables() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS submissions (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                status_updated TEXT,
                distributor_name TEXT NOT NULL,
                end_user TEXT NOT NULL,
                install_date TEXT NOT NULL,
                needed_by_date TEXT NOT NULL,
                nexus_quantity INTEGER DEFAULT 0,
                sensor_power_unit_quantity INTEGER DEFAULT 0,
                type1_sensor_quantity INTEGER DEFAULT 0,
                type2_sensor_quantity INTEGER DEFAULT 0,
                shelf_mount_kit_quantity INTEGER DEFAULT 0,
                rack_mount_kit_quantity INTEGER DEFAULT 0,
                wifi_repeater_quantity INTEGER DEFAULT 0,
                c1_harness_quantity INTEGER DEFAULT 0,
                rsm TEXT NOT NULL,
                acknowledgment BOOLEAN DEFAULT FALSE,
                invoice_number TEXT,
                additional_notes TEXT
            )
        `;

        if (this.isPostgres) {
            await this.db.query(createTableSQL);
        } else {
            await this.run(createTableSQL);
        }
    }

    // Generic query method for PostgreSQL
    async query(sql, params = []) {
        if (this.isPostgres) {
            return await this.db.query(sql, params);
        } else {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve({ rows });
                });
            });
        }
    }

    // Generic run method for SQLite
    async run(sql, params = []) {
        if (this.isPostgres) {
            return await this.db.query(sql, params);
        } else {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function(err) {
                    if (err) reject(err);
                    else resolve({ lastID: this.lastID, changes: this.changes });
                });
            });
        }
    }

    // Generic get method for single row
    async get(sql, params = []) {
        if (this.isPostgres) {
            const result = await this.db.query(sql, params);
            return result.rows[0];
        } else {
            return new Promise((resolve, reject) => {
                this.db.get(sql, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    }

    async createSubmission(submissionData) {
        console.log('Creating submission:', submissionData.id);
        const {
            id, timestamp, status, distributorName, endUser, installDate, neededByDate,
            nexusQuantity, sensorPowerUnitQuantity, type1SensorQuantity, type2SensorQuantity,
            shelfMountKitQuantity, rackMountKitQuantity, wifiRepeaterQuantity, c1HarnessQuantity,
            rsm, acknowledgment, invoiceNumber, additionalNotes
        } = submissionData;

        const sql = `
            INSERT INTO submissions (
                id, timestamp, status, distributor_name, end_user, install_date, needed_by_date,
                nexus_quantity, sensor_power_unit_quantity, type1_sensor_quantity, type2_sensor_quantity,
                shelf_mount_kit_quantity, rack_mount_kit_quantity, wifi_repeater_quantity, c1_harness_quantity,
                rsm, acknowledgment, invoice_number, additional_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            id, timestamp, status, distributorName, endUser, installDate, neededByDate,
            nexusQuantity || 0, sensorPowerUnitQuantity || 0, type1SensorQuantity || 0, type2SensorQuantity || 0,
            shelfMountKitQuantity || 0, rackMountKitQuantity || 0, wifiRepeaterQuantity || 0, c1HarnessQuantity || 0,
            rsm, acknowledgment, invoiceNumber, additionalNotes
        ];

        const result = await this.run(sql, params);
        console.log('Submission created successfully:', result);
        return result;
    }

    async getAllSubmissions() {
        const sql = 'SELECT * FROM submissions ORDER BY timestamp DESC';
        const result = await this.query(sql);
        return result.rows;
    }

    async getSubmissionById(id) {
        const sql = 'SELECT * FROM submissions WHERE id = ?';
        return await this.get(sql, [id]);
    }

    async updateSubmissionStatus(id, status) {
        const sql = `
            UPDATE submissions 
            SET status = ?, status_updated = ? 
            WHERE id = ?
        `;
        const timestamp = new Date().toISOString();
        return await this.run(sql, [status, timestamp, id]);
    }

    async getSubmissionsByStatus(status) {
        const sql = 'SELECT * FROM submissions WHERE status = ? ORDER BY timestamp DESC';
        const result = await this.query(sql, [status]);
        return result.rows;
    }

    async getSubmissionStats() {
        const sql = `
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
            FROM submissions
        `;
        const result = await this.get(sql);
        return result;
    }

    async close() {
        if (this.isPostgres) {
            await this.db.end();
        } else {
            return new Promise((resolve) => {
                this.db.close((err) => {
                    if (err) console.error('Error closing database:', err);
                    resolve();
                });
            });
        }
    }
}

module.exports = Database;
