import jwt from "jsonwebtoken";
import user from "../models/user.js";


const userAuthVerification = async (req, res) => {
  const token = req.cookies.token;
  console.log(token, "token");
  if (!token) {
    return res.json({
      success: false,
      message: "Token is not available or Invalid token",
    });
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, "DEFAULT_SECRET_KEY");

      console.log(decoded, "decoded");
      const userInfo = await user.findById(decoded.getId);

      console.log(userInfo, "userInfo");

      if (userInfo)
        return res.status(200).json({
          success: true,
          userInfo,
        });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
  }
};

export default userAuthVerification;
