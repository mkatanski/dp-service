import mongodb, { MongoClient } from "mongodb";

const client = mongodb.MongoClient;

const MONGO_USER_PWD = process.env.MONGO_USER_PWD || "";
const MONGO_USER_NAME = process.env.MONGO_USER_NAME || "";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "";

const uri = `mongodb+srv://${MONGO_USER_NAME}:${MONGO_USER_PWD}@cluster0.0kpzx.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;

const connectMongo = async (): Promise<MongoClient> => {
  return client.connect(uri);
};

export default connectMongo;
