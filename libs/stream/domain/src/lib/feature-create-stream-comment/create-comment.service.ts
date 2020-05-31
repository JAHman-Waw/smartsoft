import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {DomainValidationError} from "@smartsoft001/domain-core";

import {Stream} from "../entities";
import {IStreamCommentCreate} from "./interfaces";
import {StreamComment} from "../value-objects";

@Injectable()
export class CreateCommentService {
    constructor(
        @InjectRepository(Stream) private repository: Repository<Stream>
    ) { }

    async create(id: string, item: IStreamCommentCreate): Promise<void> {
        this.valid(id, item);

        const comment = new StreamComment(item.body, new Date(), item.username, item.annonimus);

        await this.repository.update({
            id: id
        }, {
            $push: {
                comments: {
                    $each: [ comment ],
                    $sort: { createDate: -1 },
                    $slice: 1
                }
            }
        } as any);
    }

    private valid(id, req: IStreamCommentCreate) {
        if (!id) throw new DomainValidationError("id is empty");
        if (!req) throw new DomainValidationError("item is empty");
        if (!req.body) throw new DomainValidationError("body is empty");
        if (!req.username) throw new DomainValidationError("username is empty");
    }
}
