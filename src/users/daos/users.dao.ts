import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import { v4 as uuidv4 } from 'uuid';
import mongooseService from '../../common/services/mongoose.service';
import { PermissionFlag } from '../../common/enums/common.permissionflag.enum';
import Logger from '../../common/services/logger.service';

class UsersDao {
  Schema = mongooseService.getMongoose().Schema;
  logger = new Logger('DAO:users');
  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number
    },
    { id: false }
  );
  User = mongooseService.getMongoose().model('Users', this.userSchema);

  constructor() {
    this.logger.debug('Created new instance of UsersDao');
  }

  async addUser(userFields: CreateUserDto) {
    const userId = uuidv4();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: PermissionFlag.FREE_PERMISSION
    });
    await user.save();
    this.logger.debug('Created new user');
    return userId;
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate('User').exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email: email })
      .select('_id email permissionFlags +password')
      .exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }
}

export default new UsersDao();
