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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryFactory = void 0;
const RealOrderRepository_1 = require("./repositories/RealOrderRepository");
const SimulatedOrderRepository_1 = require("./repositories/SimulatedOrderRepository");
class RepositoryFactory {
    static createPedidoRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.DB_TYPE === 'mongodb') {
                const mongodbUri = process.env.MONGO_URI || '';
                const mongoRepo = new RealOrderRepository_1.MongoOrderRepository(mongodbUri);
                yield mongoRepo.connect();
                return mongoRepo;
            }
            else {
                // Por defecto, usar SQLite o cualquier otra base de datos
                return new SimulatedOrderRepository_1.SQLiteOrderRepository();
            }
        });
    }
}
exports.RepositoryFactory = RepositoryFactory;
