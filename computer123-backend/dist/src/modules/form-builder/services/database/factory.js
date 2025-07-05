"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseServiceFactory = void 0;
const postgresql_service_1 = require("./postgresql.service");
class DatabaseServiceFactory {
    static create(type) {
        if (this.instance && this.currentType === type) {
            return this.instance;
        }
        switch (type) {
            case 'postgresql':
                this.instance = new postgresql_service_1.PostgreSQLService();
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