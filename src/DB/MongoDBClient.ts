import { MongoClient, MongoCallback } from 'mongodb';

export class MongoDBClient {
  url:string;
  db:undefined | MongoClient;
  constructor(host = 'tarpit_mongo_1', port = '27017') {
    this.url = `mongodb://${host}:${port}`;
    this.db = undefined;
  }
  connect(callback: MongoCallback<MongoClient>) {
    const user = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    // Set MONGO_USERNAME and MONGO_PASSWORD to reach an authenticated server; with neither set the driver connects unauthenticated, which is what the local container expects.
    const credentials = user && password ? { auth: { user, password } } : {};
    MongoClient.connect(
      this.url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...credentials
      },
      (err, db) => {
        if (!err) {
          console.log('MongoDB Connected');
          this.db = db;
        }
        callback(err, db);
      }
    );
  }
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}
