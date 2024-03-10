import { uploadProfilePictureToCloudinary } from "../utils/cloudinary.js";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";
import { Customer } from "../models/customer.model.js";

const buildCustomerProfile = async (req, res) => {
  const {
    name,
    email,
    gender,
    location,
    phoneNumber,
    height,
    weight,
    age,
    fitnessGoals,
    bodyFat,
  } = req.body;
 

  const profilePicture = req.file?.path;

  if (
    !(
      name &&
      email &&
      gender &&
      location &&
      phoneNumber &&
      height &&
      weight &&
      age &&
      fitnessGoals
    )
  ) {
    return errorHandler(res, 406, "All fields are mandatory!");
  }

  try {
    const profilePicturePath = await uploadProfilePictureToCloudinary(
      profilePicture
    );
    if (!profilePicturePath) {
      return errorHandler(res, 500, "Failed to upload file on cloudinary!");
    }
    await Customer.updateOne(
      {
        email,
      },
      {
        name,
        gender,
        location,
        phoneNumber,
        height,
        weight,
        age,
        fitnessGoals,
        bodyFat,
      }
    ).then(() => {
      return responseHandler(res, 200, "Profile completed!");
    });
  } catch (error) {
    errorHandler(res, 500, error.message);
  }
};

const fetchCustomerDetails = async (req, res) => {
  const { email } = req.body;
  try {
    const customerDetails = await Customer.findOne({ email });
    return responseHandler(res, 200, customerDetails);
  } catch (error) {
    errorHandler(res, 500, "Error fetching customer details!");
  }
};

export { buildCustomerProfile, fetchCustomerDetails };
