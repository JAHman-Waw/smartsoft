import { Injectable } from "@nestjs/common";
import { MongoClient } from "mongodb";

import { IEntity, IItemRepository } from "@smartsoft001/domain-core";
import { MongoConfig } from "../mongo.config";
import { IUser } from "@smartsoft001/users";

@Injectable()
export class MongoItemRepository<
  T extends IEntity<string>
> extends IItemRepository<T> {
  constructor(private config: MongoConfig) {
    super();
  }

  create(item: T, user: IUser): Promise<void> {
    return new Promise<void>((res, rej) => {
      MongoClient.connect(this.getUrl(), (err, client) => {
        if (err) {
          rej(err);
          return;
        }

        const db = client.db(this.config.database);

        db.collection(this.config.collection).insertOne(
          this.getModelToCreate(item, user),
          errInsert => {
            if (errInsert) {
              rej(errInsert);
              return;
            }

            client.close();
            res();
          }
        );
      });
    });
  }

  update(item: T, user: IUser): Promise<void> {
    return new Promise<void>((res, rej) => {
      MongoClient.connect(this.getUrl(), async (err, client) => {
        if (err) {
          rej(err);
          return;
        }

        const db = client.db(this.config.database);
        const collection = db.collection(this.config.collection);

        const info = await this.getInfo(item.id, collection);

        db.collection(this.config.collection).replaceOne(
            { _id: item.id},
            this.getModelToUpdate(item, user, info),
          errUpdate=> {
            if (errUpdate) {
              rej(errUpdate);
              return;
            }

            client.close();
            res();
          }
        );
      });
    });
  }

    updatePartial(item: Partial<T> & { id: string }, user: IUser): Promise<void> {
        return new Promise<void>((res, rej) => {
            MongoClient.connect(this.getUrl(), async (err, client) => {
                if (err) {
                    rej(err);
                    return;
                }

                const db = client.db(this.config.database);
                const collection = db.collection(this.config.collection);

                const info = await this.getInfo(item.id, collection);

                db.collection(this.config.collection).updateOne(
                    { _id: item.id},
                    { $set: this.getModelToUpdate(item, user, info) },
                    errUpdate=> {
                        if (errUpdate) {
                            rej(errUpdate);
                            return;
                        }

                        client.close();
                        res();
                    }
                );
            });
        });
    }

    delete(id: string, user: IUser): Promise<void> {
        return new Promise<void>((res, rej) => {
            MongoClient.connect(this.getUrl(), (err, client) => {
                if (err) {
                    rej(err);
                    return;
                }

                const db = client.db(this.config.database);

                db.collection(this.config.collection).deleteOne(
                    { _id: id },
                    errDelete => {
                        if (errDelete) {
                            rej(errDelete);
                            return;
                        }

                        client.close();
                        res();
                    }
                );
            });
        });
    }

  private getInfo(id: string, collection): Promise<any> {
      return new Promise<any>((res, rej) => {
          collection.aggregate([
              { $match: { _id: id } },
              { $project : { __info: 1 } }
          ]).toArray((err, array) => {
             if (err) {
                 rej(err);
                 return;
             }

             if (!array || !array[0]) {
                 res(null);
             }

             res(array[0]['__info']);
          });
      });
  }

  private getModelToCreate(item: T, user: IUser): T {
    const result = { ...item };
    result["_id"] = result.id;
    delete result.id;

    result["__info"] = {
      create: {
        username: user.username,
        date: new Date()
      }
    };

    return result;
  }

  private getModelToUpdate(item: { id: string }, user: IUser, info): { id: string } {
    const result = { ...item };
    result["_id"] = result.id;
    delete result.id;

    result["__info"] = {
      ...info,
      update: {
        username: user.username,
        date: new Date()
      }
    };

    return result;
  }

  private getUrl(): string {
    if (this.config.username && this.config.password)
      return `mongodb://${this.config.username}:${this.config.password}@${this.config.host}:${this.config.port}`;
    else return `mongodb://${this.config.host}:${this.config.port}`;
  }
}
