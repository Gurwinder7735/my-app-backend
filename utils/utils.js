const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { SERVER, SMTP } = require("../constants/constants");
const axios = require("axios");
const path = require("path");
const { response } = require("../app");
const Models = require("../models");
const { resolve } = require("path");
const AppError = require("./errorHandlers/appError");
const { STATUS_MSG } = require("./response/responseMessages");
const STATUS_CODES = require("./response/statusCodes");
const { Op, Sequelize } = require("sequelize");
const { createWorker, Image } = require("tesseract.js");
const Jimp = require("jimp");
const mailTransporter = require("../services/mailService");
const ejs = require("ejs");
const fs = require("fs");



module.exports = {
  encryptPassword: (password) => {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
  },
  comparePassword: (plainPassword, hash) => {
    return bcrypt.compareSync(plainPassword, hash); // true
  },

  generateOtp: () => {
    const otp = Math.floor(100000 + Math.random() * 9000);

    return process.env.NODE_ENV == "development" ? 111111 : otp;
    // return 111111;
  },
  generateRandomToken: (length) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const token = buffer.toString("hex");
          resolve(token);
        }
      });
    });
  },

  generateRandomPassword: (length = 8) => {
    const charset =
      "abcdefghjkmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ023456789!@#$%^&*()_+-=";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    return process.env.NODE_ENV != "development" ? password : "1111";
    // return "123456";
  },

  verifyRecaptchaCode: (recaptchaResponse) => {
    return new Promise((resolve, reject) => {
      axios
        .post("https://www.google.com/recaptcha/api/siteverify", null, {
          params: {
            secret: SERVER.GOOGLE_GOOGLE_CAPTCHA_SECRET_KEY,
            response: recaptchaResponse,
          },
        })
        .then((response) => {
          resolve(response.data.success);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getPaginatedResults: async (
    model,
    page = 1,
    limit = 10,
    where,
    attributes,
    includeOptions = [],
    otherOptions
  ) => {
    return new Promise((resolve, reject) => {
      const currentPage = Number(page); // Current page number
      const nextPage = currentPage + 1; // Calculate next page number
      const prevPage = currentPage - 1; // Calculate previous page number
      const offset = currentPage * limit - limit;

      model
        .findAndCountAll({
          include: includeOptions,
          limit: Number(limit),
          offset: offset,
          attributes,
          where,
          ...otherOptions,
        })
        .then((results) => {
          const totalPages = Math.ceil(results.count / limit);
          const hasNextPage = nextPage <= totalPages;
          const hasPrevPage = prevPage >= 1;

          resolve({
            data: results.rows,
            totalItems: results.count,
            currentPage: currentPage,
            totalPages: totalPages,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage,
          });
        })
        .catch((err) => reject(err));
    });
  },

  handleFileUpload: async (req) => {
    const folderName = req.body.folderName;
    const destinationFolder = path.join("uploads/", folderName);

    // Check if a file was uploaded
    if (!req.files) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  },

  fetchWatchDetail: (watchId) => {
    return new Promise((resolve, reject) => {
      const includeOptions = [
        {
          model: Models.SubCollections,
          required: true,
          attributes: [
            "id",
            "name",
            "image",
            "quantity",
            "color",
            "material",
            "gtin",
            "description",
          ],
          include: [
            {
              model: Models.Collections,
              attributes: [
                "name",
                "userId",
                "id",
                [
                  Sequelize.literal(
                    "(SELECT brandName FROM BrandDetails WHERE userId= `SubCollection.Collection.userId`)"
                  ),
                  "brandName",
                ],
              ],
              required: true,
              // include: {
              //   model: Models.BrandDetails,
              //   as: "brandDetails",
              //   attributes: []
              // },
            },
          ],
        },
        {
          model: Models.Users,
          attributes: ["id", "name","image","nameVisibility","imageVisibility"],
          as: "owner",
        },
      ];
      Models.Watches.findOne({
        where: {
          [Op.or]: [
            {
              watchId,
            },
            Sequelize.literal(`CAST(Watches.id AS CHAR)='${watchId}'`),
           
          ],
        },
        include: includeOptions,
      })
        .then((watch) => {
          if (!watch) {
            // throw ;
            reject(
              new AppError(
                STATUS_MSG.ERROR.INVALID_ID,
                STATUS_CODES.BAD_REQUEST
              )
            );
          } else {
            resolve(watch);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getKeyByValue: (object, value) => {
    for (const key in object) {
      if (object.hasOwnProperty(key) && object[key] === value) {
        return key;
      }
    }
    // If the value is not found, you can return null, undefined, or any other value you prefer.
    return null;
  },

  getWatchIdFromReceipt: async (
    imagePath = "https://cdn2.naturallogic.info/sites/default/files/pictures/44426_9.jpg"
  ) => {
    try {
      const start = new Date();

      /**
       * 👇 Loading the worker scripts from the tesseract core.
       */
      const worker = await createWorker();
      // await worker.load();

      /**
       *  Loads traineddata from cache or download traineddata from remote
       *  Link to install traineddata https://github.com/tesseract-ocr/tessdata
       *  You can train your own custom data but thats for another blog.
       *  👇
       */
      await worker.loadLanguage("eng");

      /**
       * 👇 Initializes the Tesseract API, make sure it is ready for doing OCR tasks.
       */
      await worker.initialize("eng");

      console.log(
        "Starting recognition process.",
        "\n_________________________________\n"
      );
      /**
       * Using destructuring assignment and
       * calling worker.recognize(image, options, jobId) on it which is a promise.
       * If the promise resolves you get the text from the image.
       */
      // const {
      //   data: { text },
      // } = await worker.recognize("https://i.imgur.com/LmFPK8Nh.jpg");

      // Use Jimp to read and preprocess the image
      const image = await Jimp.read(imagePath);
      // image.resize(1000, Jimp.AUTO); // Resize to a width of 1000 pixels while maintaining the aspect ratio
      image.greyscale(); // Convert the image to grayscale
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

      const customConfig = {
        tessedit_char_whitelist: "0123456789",
      };

      const {
        data: { text },
      } = await worker.recognize(buffer, {
        rectangle: { top: 204, left: 192, width: 280, height: 32 },
        config: customConfig,
      });

      // console.log(text, "\n_________________________________\n");

      const stop = new Date();
      let s = (stop - start) / 1000;
      console.log(`Time Taken -  ${s}\n\n`);

      /**
       * Terminating the worker to release the allocated ram.
       */
      await worker.terminate();
      return text;
    } catch (err) {
      throw err;
    }
  },

   sendMail : async ({ email, subject = "Trustlog", templateName, parameters = {} }) => {
    try {
      const emailTemplate = fs.readFileSync(
        path.join(__dirname, `../public/views/mailTemplates/${templateName}.ejs`),
        "utf-8"
      );
  
      const renderedTemplate = ejs.render(emailTemplate, { ...parameters });
  
      console.log(emailTemplate, "emailTemplate");
      console.log(parameters, "parameters");
  
      const info = await mailTransporter.sendMail({
        from: SMTP.EMAIL_FROM,
        to: email,
        subject: subject,
        text: "", // plain text body
        html: renderedTemplate, // html body
      });
  
      console.log("Email sent:", info.response);
  
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  

};
