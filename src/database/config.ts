import { connect } from "mongoose";
import process from "node:process";

const dbConnection = async () => {

  try {

    if (process.env.MONGODB_CNN)
      await connect(process.env.MONGODB_CNN);

    console.log('Database online');
  } catch (error) {
    console.log(error);
    throw new Error('Error at database initialization: ' + error);
  }


};

export {
  dbConnection
};

