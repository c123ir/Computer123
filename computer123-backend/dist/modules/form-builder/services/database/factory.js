"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseServiceFactory = void 0;
const firebase_service_1 = require("./firebase.service");
const postgresql_service_1 = require("./postgresql.service");
const memory_service_1 = require("./memory.service");
const localStorage_service_1 = require("./localStorage.service");
class DatabaseServiceFactory {
    static create(type) {
        if (this.instance && this.currentType === type) {
            return this.instance;
        }
        switch (type) {
            case 'firebase':
                this.instance = new firebase_service_1.FirebaseService();
                break;
            case 'postgresql':
                this.instance = new postgresql_service_1.PostgreSQLService();
                break;
            case 'memory':
                this.instance = new memory_service_1.MemoryDatabaseService();
                break;
            case 'localStorage':
                this.instance = new localStorage_service_1.LocalStorageService();
                break;
            default:
                throw new Error(`Database type ${type} not supported`);
        }
        this.currentType = type;
        console.log(`📊 Database service switched to: ${type.toUpperCase()}`);
        return this.instance;
    }
    static getCurrentType() {
        return this.currentType;
    }
    static reset() {
        this.instance = null;
        this.currentType = null;
    }
}
exports.DatabaseServiceFactory = DatabaseServiceFactory;
DatabaseServiceFactory.instance = null;
DatabaseServiceFactory.currentType = null;
//# sourceMappingURL=factory.js.map