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
          "email",
          "phoneNumber",
          "password",
          "notifications",
          "status",
        ],
        include: {
          model: Models.UserRoles,
          attributes: ["roleId"],
          include: {
            model: Models.Roles,
          },
        },
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
          if (role) {
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

  sendOtpMail: (email, otp) => {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../../../public/views/mailTemplates/otp.ejs"),
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, { otp });

    console.log(emailTemplate, "emailTemplate");

    return new Promise((resolve, reject) => {
      mailTransporter
        .sendMail({
          from: `${SMTP.EMAIL_FROM}`, // sender address
          to: email, // list of receivers
          subject: "Trustlog", // Subject line
          text: "", // plain text body
          html: renderedTemplate, // html body
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => reject(err.message));
    });
  },

  sendCredientialsOnEmail: (email, password) => {
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../../../public/views/mailTemplates/user.ejs"),
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, { email, password });

    console.log(emailTemplate, "emailTemplate");

    return new Promise((resolve, reject) => {
      mailTransporter
        .sendMail({
          from: `${SMTP.EMAIL_FROM}`, // sender address
          to: email, // list of receivers
          subject: "Trustlog", // Subject line
          text: "", // plain text body
          html: renderedTemplate, // html body
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => reject(err.message));
    });
  },

  sendBrandApproveRejectMail: (name, email, status) => {
    const emailTemplate = fs.readFileSync(
      path.join(
        __dirname,
        `../../../public/views/mailTemplates/brand-${
          status == 2 ? "approve" : "reject"
        }.ejs`
      ),
      "utf-8"
    );

    const renderedTemplate = ejs.render(emailTemplate, { email, name });

    console.log(emailTemplate, "emailTemplate");

    return new Promise((resolve, reject) => {
      mailTransporter
        .sendMail({
          from: `${SMTP.EMAIL_FROM}`, // sender address
          to: email, // list of receivers
          subject: `${
            status == 2
              ? " Brand Registration Approved - Welcome to TrustLog!"
              : " Brand Registration Update - Rejection Notice"
          }`, // Subject line
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
