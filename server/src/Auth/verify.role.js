const { UnAuthorizedError } = require("../Handlers/error.handler");

const ROLES = {
  SHOP: "shop",
  MOD: "mod",
  ADMIN: "admin",
};

class Role {
  static async verifyRole(requiredRoles, actualRole, req, res, next) {
    if (!requiredRoles.includes(actualRole)) {
      throw new UnAuthorizedError();
    }
    next();
  }

  static async verifyShop(req, res, next) {
    await Role.verifyRole(["shop", "mod", "admin"], ROLES.SHOP, req, res, next);
  }

  static async verifyMod(req, res, next) {
    await Role.verifyRole(["admin", "mod"], ROLES.MOD, req, res, next);
  }

  static async verifyAdmin(req, res, next) {
    await Role.verifyRole(["admin"], ROLES.ADMIN, req, res, next);
  }
}

module.exports = Role;
