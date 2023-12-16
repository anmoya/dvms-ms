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
exports.MongoOrderRepository = void 0;
const mongodb_1 = require("mongodb");
class MongoOrderRepository {
    constructor(uri) {
        this.uri = uri;
        this.collectionName = 'orders';
        this.client = new mongodb_1.MongoClient(uri);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            this.db = this.client.db();
        });
    }
    saveOrder(pedido) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(this.db);
                console.log(this.collectionName);
                const collection = this.db.collection(this.collectionName);
                yield collection.insertOne(pedido);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    // Puedes agregar aquí más métodos para otras operaciones CRUD
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
        });
    }
}
exports.MongoOrderRepository = MongoOrderRepository;
