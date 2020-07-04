import { MongoClient, MongoError, Db } from "mongodb";

const MONGO_USER_PWD = process.env.MONGO_USER_PWD || "";
const MONGO_USER_NAME = process.env.MONGO_USER_NAME || "";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "";

const uri = `mongodb+srv://${MONGO_USER_NAME}:${MONGO_USER_PWD}@cluster0.0kpzx.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let _db: Db;

export const connectMongo = async (): Promise<{
  error: MongoError;
  client: MongoClient;
  db: Db;
}> => {
  return new Promise(resolve => {
    client.connect((error, client) => {
      if (!client.isConnected()) {
        throw new Error("MongoDb connection failed");
      }

      console.log(`Connected to MongoDB: ${client.db().databaseName}`);
      _db = client.db();
      resolve({ error, client, db: _db });
    });
  });
};

export const getDatabase = (): Db => {
  if (!_db) {
    throw new Error("Database connection empty");
  }

  return _db;
};
