import mongoose from "mongoose";

const database = async () =>  {

  mongoose
    .connect(
      // "mongodb+srv://changezworld3_db_user:mnDp0Jyehdgaym6A@cluster0.adoivxu.mongodb.net/"
      "mongodb://localhost:27017/fullstacktaskappmern"
    )
    .then(() => console.log("MongoDB Connection successfull"))
    .catch((error) => console.log(`Error occured: ${error}`));

}

export default database;
