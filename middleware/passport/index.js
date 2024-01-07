// const passport = require("passport");
// const Models = require("../../models");
// const AppError = require("../../utils/errorHandlers/appError");
// const { STATUS_MSG } = require("../../utils/response/responseMessages");
// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
// const opts = {};

// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = process.env.JWT_SECRET_KEY;

// passport.use(
//   "user",
//   new JwtStrategy(opts, async (payload, done) => {
//     try {
//       console.log(payload, "payload");

//       // console.log(admin, "user");
//       const admin = await Models.Users.findOne({
//         where: {
//           id: payload.id,
//         },
//       });

//       if (admin) {
//         return done(null, admin);
//       } else {
//         return done(null, false);
//         // or you could create a new account
//       }
//     } catch (err) {
//       return done(err, false);
//     }
//   })
// );

// module.exports = {
//   initialize: () => passport.initialize(),

//   authenticateAdmin: function (req, res, next) {
//     return passport.authenticate(
//       "user",
//       {
//         session: true,
//       },
//       (info, admin, err) => {
//         if (err && err.name && err.name == "JsonWebTokenError") {
//           next(new AppError("Invalid token", 403));
//         }
//         console.log("admin", admin);
//         // console.log(STATUS_MSG.ERROR.TOKEN_NOT_FOUND,"LLL")
//         if (err) next(new AppError(STATUS_MSG.ERROR.TOKEN_NOT_FOUND, 403));

//         if (!admin) next(new AppError("Authorization is required!", 403));

//         req.auth = admin;

//         next();
//       }
//     )(req, res, next);
//   },
// };

const passport = require("passport");
const { APP } = require("../../constants/constants");
const Models = require("../../models");
const { getUser } = require("../../src/common/auth/controllerUtils");
const AppError = require("../../utils/errorHandlers/appError");
const { STATUS_MSG } = require("../../utils/response/responseMessages");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

// Define the strategy for each role
const strategies = {
  default: new JwtStrategy(opts, async (payload, done) => {
    try {
      // const user = await Models.Users.findOne({
      //   where: {
      //     id: payload.id,
      //   },
      // });

      const user = await getUser({ email: payload.email });

      if (user) {
        user.dataValues.role = user?.UserRole?.Role?.roleName;
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log(err, "err");
      return done(err, false);
    }
  }),
};

// Example usage: Determine the role based on the strategy's info object

Object.keys(APP.USER_ROLES).forEach((role) => {
  passport.use(role, strategies.default);
});
passport.use("all", strategies.default);
// Initialize passport and add the strategies
// passport.initialize();

// Middleware function to authenticate different roles
function authenticateRole(role = "all") {
  return function (req, res, next) {
    return passport.authenticate(
      role,
      {
        session: false,
      },
      (err, user) => {
        // console.log("user", user.role);
        // console.log(">>>>>>>info", role);

        if (err && err.name && err.name === "JsonWebTokenError") {
          return next(new AppError("Invalid token", 403));
        }

        if (err) {
          return next(new AppError(STATUS_MSG.ERROR.TOKEN_NOT_FOUND, 403));
        }

        if (!user) {
          return next(new AppError("Authorization is required!", 403));
        }

        if (role !== "all") {
          role = !Array.isArray(role) ? [role] : role;

          if (!role.includes(user.dataValues.role)) {
            return next(new AppError(STATUS_MSG.ERROR.NOT_AUTHORIZED, 403));
          }
        }

        req.auth = user.toJSON();
        next();
      }
    )(req, res, next);
  };
}

module.exports = {
  initialize: () => passport.initialize(),

  authenticateRole,

  authenticateAdmin: function (req, res, next) {
    return passport.authenticate(
      "user",
      {
        session: true,
      },
      (info, admin, err) => {
        if (err && err.name && err.name == "JsonWebTokenError") {
          next(new AppError("Invalid token", 403));
        }
        console.log("admin", admin);
        // console.log(STATUS_MSG.ERROR.TOKEN_NOT_FOUND,"LLL")
        if (err) next(new AppError(STATUS_MSG.ERROR.TOKEN_NOT_FOUND, 403));

        if (!admin) next(new AppError("Authorization is required!", 403));

        req.auth = admin;

        next();
      }
    )(req, res, next);
  },
};
