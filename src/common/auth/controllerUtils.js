const { SMTP } = require("../../../constants/constants");
const Models = require("../../../models");
const mailTransporter = require("../../../services/mailService");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

module.exports = {
  getUser: async (payload) => {
    return new Promise((resolve, reject) => {
      Models.Users.findOne({
        where: {
          email: payload.email,
        },
        attributes: [
          "id",
          "name",
          "firstName",
          "email",
          "phoneNumber",
          "password",
          "notifications",
          "status",
          "deviceType",
          "deviceToken",
          "brandId",
        ],
        include: [
          {
            model: Models.UserRoles,
            attributes: ["roleId"],
            include: {
              model: Models.Roles,
            },
          },
          {
            model: Models.BrandDetails,
          },
        ],
      })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => reject(err));
    });
  },

  findRoleId: (payload) => {
    return new Promise((resolve, reject) => {
      Models.Roles.findOne({
        where: {
          roleName: payload.type,
        },
      })
        .then((role) => {
          if (role.id) {
            resolve(role.id);
          } else {
            reject("Invalid Role Name");
          }
        })
        .catch((err) => reject(err));
    });
  },

  updateDeviceInfo: async (id, payload) => {
    return new Promise((resolve, reject) => {
      Models.Users.update(
        {
          deviceType: payload.deviceType,
          deviceToken: payload.deviceToken,
        },
        {
          where: {
            id,
          },
        }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  sendOtpMail: (name,email, otp) => {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../../../public/views/mailTemplates/otp.ejs"),
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, { name,otp });

    console.log(emailTemplate, "emailTemplate");

    return new Promise((resolve, reject) => {
      mailTransporter
        .sendMail({
          from: `${SMTP.EMAIL_FROM}`, // sender address
          to: email, // list of receivers
          subject: "Password Reset OTP - Action Required", // Subject line
          text: "", // plain text body
          html: renderedTemplate, // html body
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => reject(err.message));
    });
  },
  sendResetPasswordMail: (email, resetLink) => {
    const emailTemplate = fs.readFileSync(
      path.join(
        __dirname,
        "../../../public/views/mailTemplates/reset-password-mail.ejs"
      ),
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, {
      resetLink,
    });

    console.log(emailTemplate, "emailTemplate");

    return new Promise((resolve, reject) => {
      mailTransporter
        .sendMail({
          from: `${SMTP.EMAIL_FROM}`, // sender address
          to: email, // list of receivers
          subject: "Trustlog change password", // Subject line
          text: "", // plain text body
          html: renderedTemplate, // html body
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => reject(err.message));
    });
  },

  sendCredientialsOnEmail: (name, email, password, role) => {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../../../public/views/mailTemplates/user.ejs"),
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, {
      name,
      email,
      password,
      role,
    });

    console.log(emailTemplate, "emailTemplate");

    return new Promise((resolve, reject) => {
      mailTransporter
        .sendMail({
          from: `${SMTP.EMAIL_FROM}`, // sender address
          to: email, // list of receivers
          subject: "Welcome to TrustLog Platform - Your Account Credentials", // Subject line
          text: "", // plain text body
          html: renderedTemplate, // html body
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => reject(err.message));
    });
  },
  sendBrandRegisterMail: (email, name) => {
    const emailTemplate = fs.readFileSync(
      path.join(
        __dirname,
        "../../../public/views/mailTemplates/brand-register.ejs"
      ),
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, {
      name,
    });

    console.log(emailTemplate, "emailTemplate");

    return new Promise((resolve, reject) => {
      mailTransporter
        .sendMail({
          from: `${SMTP.EMAIL_FROM}`, // sender address
          to: email, // list of receivers
          subject: "Brand Registration Confirmation - Pending Approval", // Subject line
          text: "", // plain text body
          html: renderedTemplate, // html body
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => reject(err.message));
    });
  },
  sendWelcomeMailtoUser: (email, name) => {
    const emailTemplate = fs.readFileSync(
      path.join(
        __dirname,
        "../../../public/views/mailTemplates/user-welcome.ejs"
      ),
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, {
      name,
    });

    console.log(emailTemplate, "emailTemplate");

    return new Promise((resolve, reject) => {
      mailTransporter
        .sendMail({
          from: `${SMTP.EMAIL_FROM}`, // sender address
          to: email, // list of receivers
          subject: "Welcome to TrustLog - Safeguarding Your Watch Authenticity!", // Subject line
          text: "", // plain text body
          html: renderedTemplate, // html body
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => reject(err.message));
    });
  },
};
