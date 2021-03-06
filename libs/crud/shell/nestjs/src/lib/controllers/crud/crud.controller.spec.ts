import { Test, TestingModule } from "@nestjs/testing";
import {CommandBus, CqrsModule, QueryBus} from "@nestjs/cqrs";

import { CrudController } from "./crud.controller";
import { CrudService } from "@smartsoft001/crud-shell-app-services";
import { IUser } from "@smartsoft001/users";

describe("crud-shell-nestjs: CrudController", () => {
  let controller: CrudController<any>;
  let service: CrudService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CrudController],
      providers: [
        CrudService,
        {
          provide: CommandBus,
          useValue: {
            execute: () => Promise.resolve()
          }
        },
        {
          provide: QueryBus,
          useValue: {
            execute: () => Promise.resolve({})
          }
        }
      ]
    }).compile();

    controller = module.get<CrudController<any>>(CrudController);
    service = module.get<CrudService<any>>(CrudService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create()", () => {
    it("should send data, user", () => {
      const user = {} as IUser;
      const data = {} as any;
      const spy = jest.spyOn(service, "create");
      controller.create(data, user, {
        req: {
          headers: {}
        },
        send: () => "test",
        set: () => {}
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(data, user);
    });

    it("should set Location header", async () => {
      const user = {} as IUser;
      const data = {} as any;
      const res = {
        req: {
          protocol: "http",
          headers: {
            host: "test"
          },
          url: "/"
        },
        send: () => "test",
        set: () => {}
      };
      jest.spyOn(service, "create").mockReturnValue(Promise.resolve("123"));
      const spec = jest.spyOn(res, "set");

      await controller.create(data, user, res);

      expect(spec).toHaveBeenCalledTimes(1);
      expect(spec).toHaveBeenCalledWith("Location", "http://test//123");
    });
  });

  describe("readById()", () => {
    it("should set correct id and user", async () => {
      const user = {} as IUser;
      const id = "123";
      const spy = jest.spyOn(service, "readById");

      await controller.readById({ id }, user);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id, user);
    });

    it("should return correct value", async () => {
      const response = {} as IUser;
      jest
        .spyOn(service, "readById")
        .mockReturnValue(Promise.resolve(response));

      const result = await controller.readById({ id: "123" }, {} as IUser);

      expect(result).toBe(response);
    });
  });

  describe("update()", () => {
    it("should set correct id, data and user", async () => {
      const user = {} as IUser;
      const id = "123";
      const data = {};
      const spy = jest.spyOn(service, "update");

      await controller.update({ id }, data, user);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id, data, user);
    });
  });

  describe("updatePartial()", () => {
    it("should set correct id, data and user", async () => {
      const user = {} as IUser;
      const id = "123";
      const data = {};
      const spy = jest.spyOn(service, "updatePartial");

      await controller.updatePartial({ id }, data, user);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id, data, user);
    });
  });

  describe("delete()", () => {
    it("should set correct id  and user", async () => {
      const user = {} as IUser;
      const id = "123";
      const spy = jest.spyOn(service, "delete");

      await controller.delete({ id }, user);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(id, user);
    });
  });
});
