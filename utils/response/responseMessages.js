const RESPONSE_MSGS = {
  STATUS_MSG: {
    SUCCESS: {
      DEFAULT: {
        message: {
          en: "success",
          ge: "Erfolg",
        },
      },
      REGISTER_SUCCESS: {
        message: {
          en: "User registered successfully.",
          ge: "Erfolg",
        },
      },
      LOGIN_SUCCESS: {
        message: {
          en: "User logged in successfully!.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "LOGIN_SUCCESS",
      },
      ACCOUNT_REMOVED_SUCCESS: {
        message: {
          en: "Account removed successfully.!.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "LOGIN_SUCCESS",
      },
      LOGOUT_SUCCESS: {
        message: {
          en: "Log out success!.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "LOGIN_SUCCESS",
      },
      OTP_SENT_SUCCESS: {
        message: {
          en: "Otp send successfully on email!.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "LOGIN_SUCCESS",
      },
      LINK_SUCCESS: {
        message: {
          en: "Password reset link successfully sent on email.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "LOGIN_SUCCESS",
      },
      OTP_MATCHED: {
        message: {
          en: "OTP matched",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "LOGIN_SUCCESS",
      },
      PASSWORD_CHANGE_SUCCESS: {
        message: {
          en: "Password changed successfully",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "LOGIN_SUCCESS",
      },
      UPDATE_SUCCESS: {
        message: {
          en: "Resource updated successfully",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "LOGIN_SUCCESS",
      },
      DELETE_SUCCESS: {
        message: {
          en: "Resource deleted successfully",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DELETE_SUCCESS",
      },
      COLLECTION_DELETE_SUCCESS: {
        message: {
          en: "Collection deleted successfully",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DELETE_SUCCESS",
      },
      COLLECTION_UPDATE_SUCCESS: {
        message: {
          en: "Collection updated successfully",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DELETE_SUCCESS",
      },
      OWNERSHIP_TRANSFER_REQUEST_CREATE_SUCCESS: {
        message: {
          en: "Ownership transer request was successfully created.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DELETE_SUCCESS",
      },
      CLAIM_OWNERSHIP_SUCCESS: {
        message: {
          en: "Ownership claimed successfully.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DELETE_SUCCESS",
      },
      REQUEST_REJECTED: {
        message: {
          en: "Request Rejected Successfully.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      REQUEST_APPROVED_SUCCESS: {
        message: {
          en: "Your request approved successfully.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      REQUEST_CANCELLED_SUCCESS: {
        message: {
          en: "Your request cancelled successfully.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      PAYMENT_STATUS_UPDATE: {
        message: {
          en: "Payment Status Update Successfully.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
    },

    ERROR: {
      DEFAULT: {
        message: {
          en: "Error",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      INVALID_CREDIENTIALS: {
        message: {
          en: "Invalid email or password",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      INCORRECT_OLD_PASSWORD: {
        message: {
          en: "Old password is incorrect",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      INVALID_TOKEN: {
        message: {
          en: "Invalid token",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      INVALID_ID: {
        message: {
          en: "Invalid id",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      UNAUTHORIZED_ACCESS: {
        message: {
          en: "Unauthorized access.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      WATCH_ALREADY_SCANNED: {
        message: {
          en: "This watch is already manufactured. Please scan another watch.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      WATCH_ALREADY_SOLD: {
        message: {
          en: "This watch is already sold. Please scan another watch.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      WATCH_NOT_MANUFACTURED: {
        message: {
          en: "This watch is not manufactured. Please scan another watch.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      WATCH_NOT_SOLD: {
        message: {
          en: "This watch is not sold yet",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      WATCH_NOT_SOLD: {
        message: {
          en: "This watch is not sold yet",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      ALREADY_OWNS_WATCH: {
        message: {
          en: "You already claims ownership of this watch.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      OWNERSHIP_ALREADY_CLAIMED: {
        message: {
          en: "Ownership of this watch has already been claimed.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      INVALID_VERIFICATION_CODE: {
        message: {
          en: "Invalid verification code!",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },

      APPROVAL_PENDING: {
        message: {
          en: "Your account in not approved!",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      OTP_NOT_MATCH: {
        message: {
          en: "OTP does not match",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      EMAIL_NOT_EXISTS: {
        message: {
          en: "Email doest not exist!",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      EMAIL_ALREADY_EXISTS: {
        message: {
          en: "Email already exists!",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      NAME_ALREADY_EXISTS: {
        message: {
          en: "name already exists!",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "NAME_ALREADY_EXISTS",
      },
      ALREADY_EXISTS: {
        message: {
          en: "entity already exists!",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "NAME_ALREADY_EXISTS",
      },
      PHONE_ALREADY_EXISTS: {
        message: {
          en: "Phone already exists!",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "DEFAULT",
      },
      TOKEN_EXPIRED: {
        message: {
          en: "Token Expired",
          ge: " انتهت صلاحية الرمز ",
        },
        type: "TOKEN_EXPIRED",
      },
      TOKEN_NOT_FOUND: {
        message: {
          en: "TOKEN_NOT_FOUND",
          ge: " انتهت صلاحية الرمز ",
        },
        type: "TOKEN_NOT_FOUND",
      },
      NOT_AUTHORIZED: {
        message: {
          en: "You are not authorized to access this.",
          ge: " انتهت صلاحية الرمز ",
        },
        type: "TOKEN_NOT_FOUND",
      },
      CREATED: {
        message: {
          en: "Successfully created.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      OTP_SENT_FAILED: {
        message: {
          en: "Failed to send otp!",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      VERIFICATION_EXPIRED: {
        message: {
          en: "Verification has expired.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      ALREADY_CREATED_REQUEST: {
        message: {
          en: "Request Alerady created.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      NOT_OWNER: {
        message: {
          en: "Your are not the owner of this watch.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      REQUEST_BELONGS_OTHER_USER: {
        message: {
          en: "This request belongs to other uesr.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      TRANSFER_FEES_ALREADY_PAID: {
        message: {
          en: "Transfer fees for this request is already paid.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      REQUEST_NOT_APPROVED: {
        message: {
          en: "This request is not approved yet.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      REQUEST_REJECTED: {
        message: {
          en: "This request had been rejected.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      INVALID_REQUEST: {
        message: {
          en: "This request belongs to some other user.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      ALREADY_PAID: {
        message: {
          en: "Transfer fees for this request is already paid.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      UNSUPPORTED_FILE: {
        message: {
          en: "Error: Unsupported file. Please upload a receipt image.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      INVALID_RECEIPT: {
        message: {
          en: "Error: Unable to verify watch.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
      CODE_ALREADY_EXISTS: {
        message: {
          en: "Code already exists. Select a different one.",
          ge: " تم الإنشاء بنجاح ",
        },
        type: "CREATED",
      },
    },
  },
};

module.exports = RESPONSE_MSGS;
