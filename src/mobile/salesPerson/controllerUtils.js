const Models = require("../../../models");

module.exports = {
    generateRandomCodeForWatch: async() => {

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = "";
        let alreadyExists = await module.exports.codeExistsInDatabase(code)

        do {
          code = '';
          for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            code += alphabet.charAt(randomIndex);
          }
        } while (alreadyExists);
      
        return code;
    },
     codeExistsInDatabase: async(code) =>  {

        const alreadyExists = await Models.Watches.count({
            where: {
                verificationCode: code
            }
        })
        return alreadyExists == 1 ? true: false;
      }
}