"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteOrderRepository = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
class SQLiteOrderRepository {
    constructor() {
        this.initializeDatabase();
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield (0, sqlite_1.open)({
                filename: './database.db',
                driver: sqlite3_1.default.Database
            });
            yield this.db.run('DROP TABLE IF EXISTS orders');
            yield this.db.run('CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, detalles TEXT)');
        });
    }
    saveOrder(pedido) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db) {
                throw new Error('sqlite problem');
            }
            yield this.db.run('INSERT INTO orders (id, detalles) VALUES (?, ?)', pedido.id);
        });
    }
}
exports.SQLiteOrderRepository = SQLiteOrderRepository;
