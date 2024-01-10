const { UnAuthorizedError } = require("../Handlers/error.handler");

const ROLES = {
  user: 100,
  shop: 101,
  mod: 102,
  admin: 103,
};

class Role {
  static async verifyRole(requiredRole, req, res, next) {
    const roleNumber = ROLES[req.role];

    if (!Number.isInteger(roleNumber) || requiredRole > roleNumber) {
      throw new UnAuthorizedError();
    }

    next();
  }

  static async verifyShop(req, res, next) {
    await Role.verifyRole(ROLES.shop, req, res, next);
  }

  static async verifyMod(req, res, next) {
    await Role.verifyRole(ROLES.mod, req, res, next);
  }

  static async verifyAdmin(req, res, next) {
    await Role.verifyRole(ROLES.admin, req, res, next);
  }
}

module.exports = Role;
