import express from 'express';
import usersService from '../services/users.service';
import argon2 from 'argon2';
import { PatchUserDto } from '../dto/patch.user.dto';
import Logger from '../../common/services/logger.service';

const logger = new Logger('CONTROLLER:users');
class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.body.id);
    res.status(200).send(user);
  }

  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    const userId = await usersService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    logger.debug(await usersService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    logger.debug(await usersService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeUser(req: express.Request, res: express.Response) {
    logger.debug(await usersService.deleteById(req.body.id));
    res.status(204).send();
  }

  //TODO this should not be accessible to users, but is not an admin only function
  async updatePermissionFlags(req: express.Request, res: express.Response) {
    const patchUserDto: PatchUserDto = {
      permissionFlags: parseInt(req.params.permissionFlags)
    };
    logger.debug(await usersService.patchById(req.body.id, patchUserDto));
    res.status(204).send();
  }
}

export default new UsersController();
