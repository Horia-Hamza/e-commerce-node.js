import mongoose from "mongoose";
export const connectDB = async () => {
  return await mongoose
    .connect(process.env.DBURI)
    .then((res) => console.log(`connect successfully on.....${process.env.DBURI}`) )
    .catch((error) => console.log(`error connect on.....${error}`));
};
